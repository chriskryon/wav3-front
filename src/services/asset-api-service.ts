import axios from "axios";
import { api } from "./api-config";

/**
 * Fetches the list of available assets.
 * @param type Optional filter for asset type (e.g., "crypto", "fiat").
 * @returns A list of assets.
 */
export async function listAssets(type?: string): Promise<any> {
    try {
        const response = await api.get("/assets", {
            params: type ? { type } : undefined,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message || "Failed to fetch assets.");
        }
        throw new Error("Unexpected error occurred.");
    }
}

/**
 * Fetches the networks available for a specific asset.
 * @param asset The identifier of the asset (e.g., "BTC", "ETH").
 * @returns A list of networks for the asset.
 */
export async function listAssetNetworks(asset: string): Promise<any> {
  try {
    const response = await api.get(`/assets/${asset}/networks`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch asset networks.");
    }
    throw new Error("Unexpected error occurred.");
  }
}
