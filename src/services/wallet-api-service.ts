import { api } from "./api-config";

export async function registerExternalWallet(payload: {
  asset: string;
  name: string;
  address: string;
  network: string;
}): Promise<{
  id: string;
  network: string;
  asset: string;
  address: string;
  address_tag: string;
  wallet_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}> {
  try {
    const response = await api.post("/wallets/external", payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao registrar a carteira externa.");
  }
}

export async function registerSharedWallet(payload: {
  asset: string;
  network: string;
}): Promise<{
  id: string;
  network: string;
  asset: string;
  address: string;
  address_tag: string;
  wallet_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  message?: string;
  details?: any;
  error?: string;
}> {
  try {
    const response = await api.post("/wallets/shared", payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao registrar a carteira compartilhada.");
  }
}

export async function listWallets(params?: {
  asset?: string;
  wallet_type?: string;
}): Promise<{
  list: Array<{
    id: string;
    network: string;
    asset: string;
    address: string;
    address_tag: string;
    wallet_type: string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
  }>;
}> {
  try {
    const response = await api.get("/wallets", { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao listar as carteiras.");
  }
}

export async function deleteWallet(walletId: string): Promise<{
  message: string;
}> {
  try {
    const response = await api.delete(`/wallets/${walletId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Ocorreu um erro inesperado ao deletar a carteira.");
  }
}