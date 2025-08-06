import axios from "axios";
import { api } from "./api-config";

// Response type for createAccount
interface CreateAccountResponse {
  id: string;                    // ID da sub-conta no Beta Ramps
  account_id: string;           // ID da conta principal no Beta Ramps
  name: string;                 // Nome do titular
  email: string;                // Email da conta
  is_active: boolean;           // Status da conta
  country: string;              // País
  city: string;                 // Cidade
  address: string;              // Endereço
  tax_id_type: string;          // Tipo do documento (CPF, CNPJ, etc)
  tax_id_number: string;        // Número do documento
  local_id_type: string;        // Tipo de ID local
  local_id_number?: string;     // Número do ID local (opcional)
  phone: string;                // Telefone
  post_code: string;            // CEP/Código postal
  message: string;              // Mensagem de resposta
  created_at: string;           // Data de criação (ISO string)
}

// Creates a new Beta account with the provided account data.
export async function createAccount(accountData: {
  user_id: string;
  name: string;
  email: string;
  country: string;
  city?: string;
  address?: string;
  tax_id_type: string;
  tax_id_number: string;
  local_id_type?: string;
  local_id_number?: string;
  phone?: string;
  post_code?: string;
}): Promise<CreateAccountResponse> {
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

export async function getAccountBalances(): Promise<any> {
  try {
    const response = await api.get(`/accounts/balances`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch account balances.");
    }
    throw new Error("Unexpected error occurred.");
  }
}