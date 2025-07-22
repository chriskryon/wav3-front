import { api } from "./api-config";

export async function registerBankAccount(payload: {
  bank_name: string;
  account_number: string;
  account_type: string;
  instant_payment: string;
  instant_payment_type: string;
  city: string;
  state: string;
  postal_code: string;
  street_line: string;
}): Promise<{
  id: string;
  bank_name: string;
  account_number: string;
  account_type: string;
  instant_payment: string;
  instant_payment_type: string;
  city: string;
  state: string;
  postal_code: string;
  street_line: string;
  created_at: string;
  updated_at: string;
  message?: any;
  error?: any;
}> {
  try {
    const response = await api.post("/bank-accounts/external", payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao registrar a conta bancária externa.");
  }
}

interface RegisterSharedBankResponse {
  id: string,
  sub_account_id: string,
  bank_type: string,
  instant_payment: string,
  instant_payment_type: string,
  instant_payment_qrcode_url: string,
  country: string,
  asset: string,
  bank_code: string,
  branch: string,
  account: string,
  street_line: string,
  created_at: string,
  updated_at: string,
}

export async function registerSharedBankAccount(payload: { asset: string }): Promise<RegisterSharedBankResponse | { message: string; error?: any }> {
  try {
    const response = await api.post("/bank-accounts/shared", payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao registrar a conta bancária compartilhada.");
  }
}

export async function listBankAccounts(): Promise<{
  list: Array<{
    id: string;
    name: string;
    bank_name: string;
    bank_code: string;
    branch: string;
    account: string;
    bank_type: string;
    instant_payment: string;
    instant_payment_type: string;
    country: string;
    asset: string;
    city: string;
    state: string;
    postal_code: string;
    street_line: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
}> {
  try {
    const response = await api.get("/bank-accounts");
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao listar as contas bancárias.");
  }
}

export async function deleteBankAccount(bankAccountId: string): Promise<{
  message: string;
}> {
  try {
    const response = await api.delete(`/bank-accounts/${bankAccountId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao deletar a conta bancária.");
  }
}