// Account
export interface CreateBetaAccountPayload {
  user_id: string;
  tax_id_number: string;
  tax_id_type: string;
  email: string;
  name: string;
  country: string;
  local_id_type?: string;
  local_id_number?: string;
  post_code?: string;
  city?: string;
  address?: string;
  phone?: string;
}

export interface CreateBetaAccountResponse {
  account: any;
  beta?: Record<string, any>;
  local?: Record<string, any>;
  error?: string;
  message?: string;
  id?: string;
  account_id?: string;
  name?: string;
  email?: string;
  is_active?: boolean;
  country?: string;
  city?: string;
  address?: string;
  tax_id_type?: string;
  tax_id_number?: string;
  local_id_type?: string;
  local_id_number?: string;
  phone?: string;
  post_code?: string;
  created_at?: string;
}

// Wallets
export interface Wallet {
  id: string;
  network: string;
  asset: string;
  address: string;
  address_tag?: string | null;
  wallet_type: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ListWalletsResponse {
  list: Wallet[];
}

export interface RegisterWalletPayload {
  asset: string;
  name: string;
  address: string;
  network: string;
}

export interface RegisterWalletResponse {
  message?: string;
  id: string;
  network: string;
  asset: string;
  address: string;
  address_tag: string;
  wallet_type: 'external';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  error?: string;
}

export interface RegisterSharedWalletPayload {
  asset: string;
  network: string;
}

export interface RegisterSharedWalletResponse {
  id: string;
  asset: string;
  network: string;
  address: string;
  address_tag?: string;
  wallet_type?: 'shared';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  // Mensagem de erro ou status (para erros 400/409/500)
  message?: string;
  // Detalhes de erro de validação (para 400)
  details?: Array<{
    code: string;
    expected?: string;
    received?: string;
    path?: string[];
    message: string;
  }>;
}

// Banking Accounts
export interface BankAccount {
  id: string;
  account_id: string;
  beta_bank_account_id: string;
  asset: string;
  name: string;
  bank_name: string;
  branch: string;
  country: string;
  account: string;
  instant_payment: string;
  instant_payment_type: string;
  city: string;
  postal_code: string;
  state: string;
  street_line: string;
  created_at: string;
  bank_type?: string; // 'shared' para contas compartilhadas
}

export interface ListBankAccountsResponse {
  list: BankAccount[];
}

export interface RegisterBankAccountPayload {
  asset: string;
  name: string;
  bank_name: string;
  branch: string;
  country: string;
  account: string;
  instant_payment?: string;
  instant_payment_type?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  street_line?: string;
}

export interface RegisterBankAccountResponse {
  id?: string;
  account_id?: string;
  beta_bank_account_id?: string;
  asset?: string;
  name?: string;
  bank_name?: string;
  branch?: string;
  country?: string;
  account?: string;
  instant_payment?: string;
  instant_payment_type?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  street_line?: string;
  created_at?: string;
  message?: string;
  details?: any;
}

export interface RegisterSharedBankAccountPayload {
  asset: string;
}

export interface RegisterSharedBankAccountResponse {
  id: string;
  sub_account_id: string;
  bank_type: 'shared';
  instant_payment: string;
  instant_payment_type: string;
  instant_payment_qrcode_url: string;
  country: string;
  asset: string;
  bank_code: string;
  branch: string;
  account: string;
  street_line: string;
  created_at: string;
  updated_at: string;
  message?: string; // para erros
}

// --- QUOTE ---
/**
 * Interface para request do endpoint /accounts/quote
 */
export interface QuoteRequest {
  source_asset: string; // Ex: "BTC", "USDT", "BRL"
  target_asset: string; // Ex: "BRL", "USDT", "BTC"
  network: string;      // Ex: "bitcoin", "ethereum", "polygon"
  product: string;      // Sempre "exchange"
  source_amount?: number;
  target_amount?: number;
}

/**
 * Interface para response do endpoint /accounts/quote
 */
export interface QuoteResponse {
  asset: {
    name?: string;
    type: string;
    small_image_url: string;
    medium_image_url: string;
    large_image_url: string;
  };
  price?: {
    symbol: string;
    price: number;
  };
  price_reference?: number; // Preço de referência, se disponível
  source_amount: number;
  source_amount_estimate?: number;
  source_asset: string;
  target_amount?: number;
  target_amount_estimate?: number;
  target_asset: string;
}

/**
 * Interface para erro do endpoint /accounts/quote
 */
export interface QuoteError {
  message: string;
}


// Tipos para resposta da ordem
export interface OrderAsset {
  name: string;
  type: string;
  symbol: string;
  small_image_url: string;
  medium_image_url: string;
  large_image_url: string;
}

export interface OrderResponse {
  amount: number;
  asset: OrderAsset;
  date_time: string;
  deposit: boolean;
  exp_time: number;
  message?: string;
  network: string;
  tag?: string;
  wallet_address?: string;
}