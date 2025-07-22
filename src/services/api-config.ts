import type { User } from "@/entities/user";
import { useUserStore } from "@/stores/user-store";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  console.log("API URL:", API_URL);
  
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("API URL:", API_URL);
    
    console.log("Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export function setUserGlobal(user: User | null) {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
  useUserStore.getState().setUser(user);
}