import type { User } from "@/entities/user";
import axios from "axios";
import { api, setUserGlobal } from "./api-config";

export async function registerUser({
  name,
  email,
  password,
}: Omit<User, 'id'>): Promise<{
  token: string;
  user_id?: string;
  hasBetaAccount?: boolean;
}> {
  try {
    const response = await api.post('/user/signup', { name, email, password });

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    const user = response.data?.user || { name, email };
    const hasBetaAccount = response.data?.hasBetaAccount ?? false;

    const userToStore: User = {
      ...user,
      hasBetaAccount,
    };
    setUserGlobal(userToStore);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to register user.'
      );
    }
    throw new Error('Unexpected error occurred.');
  }
}

export async function loginUser({
  email,
  password,
}: Pick<User, 'email' | 'password'>): Promise<{
  token: string;
  user: User;
  hasBetaAccount: boolean;
}> {
  try {
    const response = await api.post('/user/signin', { email, password });

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    const user = response.data?.user || {};
    const hasBetaAccount = response.data?.hasBetaAccount ?? false;

    const userToStore: User = {
      ...user,
      hasBetaAccount,
    };
    setUserGlobal(userToStore);

    return { ...response.data, user: userToStore, hasBetaAccount };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to login user.'
      );
    }
    throw new Error('Unexpected error occurred.');
  }
}