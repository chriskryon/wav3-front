import axios from "axios";
import { api } from "./api-config";

// Creates a new Beta account with the provided account data.
export async function createAccount(accountData: {
  user_id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  address: string;
  tax_id_type: string;
  tax_id_number: string;
}): Promise<any> {
  try {
    const response = await api.post("/accounts", accountData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to create account.");
    }
    throw new Error("Unexpected error occurred.");
  }
}

// Retrieves the balance of a specific asset linked to the authenticated Beta account.
export async function getAccountBalance(asset: string): Promise<any> {
  try {
    const response = await api.get(`/accounts/balance`, {
      params: { asset },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch account balance.");
    }
    throw new Error("Unexpected error occurred.");
  }
}

// Fetches the details of the authenticated Beta account.
export async function getAccountDetails(): Promise<any> {
  try {
    const response = await api.get(`/accounts/details`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch account details.");
    }
    throw new Error("Unexpected error occurred.");
  }
}