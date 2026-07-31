// ----- ./src/services/clientService.ts -----
import apiClient from "@/lib/axios";

export const updateClient = async (id: string, data: any) => {
  const response = await apiClient.put(`/api/clients/${id}`, data);
  return response.data;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/api/clients/check-email?email=${encodeURIComponent(email)}`);
    return !!response.data.exists;
  } catch {
    return false;
  }
};

export const checkNationalId = async (id: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/api/clients/check-cni?cni=${encodeURIComponent(id)}`);
    return !!response.data.exists;
  } catch {
    return false;
  }
};

export const deleteClient = async (id: string) => {
  const response = await apiClient.delete(`/api/clients/${id}`);
  return response.data;
};

export const createClient = async (data: any) => {
  // Perform an actual POST request to the API route so that the user is saved to getMutableDB()
  const payload = {
    email: data.email,
    password: data.motDePasse,
    firstName: data.prenom,
    lastName: data.nom,
    phone: data.telephone,
  };
  const response = await apiClient.post("/api/clients", payload);
  return response.data;
};