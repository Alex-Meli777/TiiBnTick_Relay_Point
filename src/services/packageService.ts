import apiClient from '@/lib/axios';

const API_URL = '/api/announcements';

export enum AddressType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY"
}

export type AddressDTO = {
  street: string;
  city: string;
  district: string;
  country: string;
  description?: string;
  type: AddressType;
  latitude?: number;
  longitude?: number;
};

export type PacketDTO = {
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  fragile: boolean;
  description?: string;
  photoPacket?: string;
  isPerishable: boolean;
  thickness?: number;
  designation: string;
};

export type PackageCreationPayload = {
  clientId: string;
  title: string;
  description?: string;
  recipientFirstName: string;
  recipientLastName: string;

  recipientEmail: string;
  recipientPhone: string;
  shipperFirstName: string;
  shipperLastName: string;
  shipperEmail: string;
  shipperPhone: string;
  amount: number;
  signatureUrl?: string | null;
  paymentMethod: string;
  transportMethod: string;
  distance?: number;
  duration?: number;

  pickupAddress: AddressDTO;
  deliveryAddress: AddressDTO;
  packet: PacketDTO;
};

export const packageService = {
  createPackage: async (payload: PackageCreationPayload) => {
    try {
      const response = await apiClient.post(API_URL, payload);
      return response.data;
    } catch (error: any) {
      console.error('Error creating package/announcement:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default packageService;

// Add this at the bottom of src/services/packageService.ts

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = (await res.json().catch(() => ({}))) as ApiResponse<T> & T;
  if (!res.ok) throw new ApiError(res.status, body.error ?? res.statusText);
  return body;
}

export function unwrapData<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === undefined) {
    throw new ApiError(500, response.error ?? "Réponse invalide");
  }
  return response.data;
}