import { api } from "./api-config";

// Types for exchange operations based on backend DTOs
interface GetQuotePayload {
  source_asset: string;
  target_asset: string;
  network: string;
  product: string;
  target_amount?: number;
  source_amount?: number;
}

interface CreateOrderDTO {
  source_asset: string;
  target_asset: string;
  network: string;
  product: string;
  source_amount?: number;
  target_amount?: number;
  target_destination?: string;
  target_destination_tag?: string;
  instant_payment_type?: string;
}

interface CreateWithdrawalOrderDTO {
  target_asset: string;
  network?: string;
  target_destination?: string;
  target_amount: number | string;
  target_destination_tag?: string;
  instant_payment_type?: string;
}

interface ListOrdersParams {
  order_by?: string;
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

interface OrderDetails {
  id: string;
  status: string;
  source_asset: string;
  target_asset: string;
  source_amount: number;
  target_amount: number;
  created_at: string;
  updated_at: string;
}

interface ListOrdersResponse {
  orders: OrderDetails[];
  total: number;
  page: number;
  size: number;
}

// Get quote for asset pair - POST /quote
export async function getQuote(payload: GetQuotePayload): Promise<any> {
  try {
    const response = await api.post("/exchange/quote", payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Unknown error while fetching quote");
  }
}

// Create exchange order - POST /order
export async function createExchangeOrder(data: CreateOrderDTO): Promise<any> {
  try {
    const response = await api.post("/exchange/order", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Unknown error while creating exchange order");
  }
}

// Create withdrawal order - POST /order/withdrawal
export async function createWithdrawalOrder(data: CreateWithdrawalOrderDTO): Promise<any> {
  try {
    const response = await api.post("/exchange/order/withdrawal", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Unknown error while creating withdrawal order");
  }
}

// List orders with optional filters - GET /order
export async function listOrders(params: ListOrdersParams = {}): Promise<ListOrdersResponse> {
  try {
    const response = await api.get("/exchange/order", { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to list orders");
  }
}

// Get details of a specific order - GET /order/:id
export async function getOrderDetails(orderId: string): Promise<OrderDetails> {
  try {
    const response = await api.get(`/exchange/order/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to get order details");
  }
}
