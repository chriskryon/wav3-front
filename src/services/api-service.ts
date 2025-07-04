import axios from 'axios';
import type { User } from '@/entities/user';
import { useUserStore } from '@/stores/user-store';
import type {
  CreateBetaAccountPayload,
  ListBankAccountsResponse,
  ListWalletsResponse,
  RegisterBankAccountPayload,
  RegisterBankAccountResponse,
  RegisterSharedBankAccountPayload,
  RegisterSharedBankAccountResponse,
  RegisterSharedWalletPayload,
  RegisterSharedWalletResponse,
  RegisterWalletPayload,
  RegisterWalletResponse,
} from '@/entities/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// Cria uma instância do axios
const api = axios.create({ baseURL: API_URL });

console.log("API rodando em:", API_URL);

// Middleware para adicionar o token Bearer automaticamente
api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export async function registerUser({
  name,
  email,
  password,
}: Omit<User, 'id'>): Promise<{
  token: string;
  user_id?: string;
  hasBetaAccount?: boolean;
}> {
  const response = await api.post('/register', { name, email, password });
  if (response.data?.token) localStorage.setItem('token', response.data.token);

  // Extrai dados do usuário e do status beta
  const user = response.data?.user || { name, email };
  const hasBetaAccount = response.data?.hasBetaAccount ?? false;

  // Logging para debug
  console.log('registerUser response.data:', response.data);
  console.log('user:', user);
  console.log('hasBetaAccount:', hasBetaAccount);

  // Monta objeto para Zustand/localStorage
  const userToStore: User = {
    ...user,
    hasBetaAccount,
  };
  setUserGlobal(userToStore);

  return response.data;
}

export async function loginUser({
  email,
  password,
}: Pick<User, 'email' | 'password'>): Promise<{
  token: string;
  user: User;
  hasBetaAccount: boolean;
}> {
  const response = await api.post('/login', { email, password });
  console.log('Login response:', response.data);

  if (response.data?.token) localStorage.setItem('token', response.data.token);

  // Extrai dados do usuário e do status beta
  const user = response.data?.user || {};
  const hasBetaAccount = response.data?.hasBetaAccount ?? false;

  // Monta objeto para Zustand/localStorage
  const userToStore: User = {
    ...user,
    hasBetaAccount,
  };
  setUserGlobal(userToStore);

  return { ...response.data, user: userToStore, hasBetaAccount };
}

/**
 * Busca detalhes da subconta Beta do usuário autenticado.
 * Requer JWT válido no header Authorization.
 * @returns Detalhes da subconta Beta ou lança erro com mensagem apropriada.
 */
export async function getBetaAccountDetail(): Promise<any> {
  try {
    const response = await api.get('/accounts/detail');
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar detalhes da subconta Beta.');
  }
}

export async function createAccount(
  payload: CreateBetaAccountPayload,
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await api.post('/accounts', payload);
    if (response.status === 201) {
      if (response.data?.token)
        localStorage.setItem('token', response.data.token);
      // Extrai dados do usuário e da conta
      const user = response.data?.user || {};
      const account = response.data?.account || null;
      const profileCompleted = !!account;
      const userToStore = {
        ...user,
        isLoggedIn: true,
        profileCompleted,
        account,
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
      return { success: true, data: response.data };
    }
    return { success: false, message: 'Resposta inesperada do servidor.' };
  } catch (error: any) {
    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message || 'Erro ao criar conta.',
      };
    }
    return {
      success: false,
      message: 'Erro de rede ou desconhecido ao criar conta.',
    };
  }
}

export interface BetaAccountDetails {
  subaccount_id: string;
  [key: string]: any;
}

export interface GetAccountByInternalIdResponse {
  betaSubaccountId: BetaAccountDetails | null | undefined;
  subaccount_id: BetaAccountDetails | null | undefined;
  beta?: BetaAccountDetails;
  local?: Record<string, any>;
  error?: string;
}

export async function getAccountByInternalId(
  accountId: string,
): Promise<GetAccountByInternalIdResponse> {
  try {
    const response = await api.get(`/accounts/internal/${accountId}/beta`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

export async function getAccountByEmail(
  email: string,
): Promise<GetAccountByInternalIdResponse> {
  try {
    const response = await api.get(
      `/accounts/by-email/${encodeURIComponent(email)}`,
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

// --- Carteiras (Wallets) ---
export async function registerWallet(
  payload: RegisterWalletPayload,
): Promise<RegisterWalletResponse> {
  try {
    const response = await api.post('/accounts/wallet', payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

export async function listWallets(params?: {
  asset?: string;
  wallet_type?: string;
}) {
  try {
    const response = await api.get<ListWalletsResponse>('/accounts/wallets', {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Falha ao listar wallets na Beta Ramps');
  }
}

export async function deleteWallet(id: string) {
  try {
    const response = await api.delete(`/accounts/wallet/${id}`);
    if (response.status === 200 || response.status === 204)
      return { success: true };
    if (response.data?.message) return { message: response.data.message };
    return { message: 'Erro ao deletar wallet' };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    return { message: 'Erro ao deletar wallet' };
  }
}

export async function registerWalletShared(
  payload: RegisterSharedWalletPayload,
): Promise<RegisterSharedWalletResponse> {
  try {
    const response = await api.post('/accounts/shared-wallet', payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

// -- Banking Accounts --
/**
 * Lista as contas bancárias externas cadastradas para a subconta Beta do usuário autenticado.
 * @param params asset (opcional), bank_name (opcional)
 */
export async function listBankAccounts(params?: {
  asset?: string;
  bank_name?: string;
}): Promise<ListBankAccountsResponse> {
  try {
    const response = await api.get<ListBankAccountsResponse>(
      '/accounts/bank-account',
      { params },
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Falha ao listar contas bancárias.');
  }
}

/**
 * Registra uma conta bancária externa para a subconta Beta do usuário autenticado.
 * @param payload Dados da conta bancária
 */
export async function registerBankAccount(
  payload: RegisterBankAccountPayload,
): Promise<RegisterBankAccountResponse> {
  try {
    const response = await api.post<RegisterBankAccountResponse>(
      '/accounts/bank-account',
      payload,
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

/**
 * Registra uma conta bancária compartilhada para a subconta Beta do usuário autenticado.
 * @param payload Dados da conta bancária compartilhada
 */
export async function registerSharedBankAccount(
  payload: RegisterSharedBankAccountPayload,
): Promise<RegisterSharedBankAccountResponse> {
  try {
    const response = await api.post<RegisterSharedBankAccountResponse>(
      '/accounts/bank-account/shared',
      payload,
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

// Deleta uma conta bancária externa para a subconta Beta do usuário autenticado.
export async function deleteBankAccount(
  id: string,
): Promise<{ success?: boolean; message?: string }> {
  try {
    const response = await api.delete(`/accounts/bank-account/${id}`);

    if (response.status === 200 || response.status === 204)
      return { success: true };

    if (response.data?.message) return { message: response.data.message };

    return { message: 'Erro ao deletar conta bancária' };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    return { message: 'Erro ao deletar conta bancária' };
  }
}