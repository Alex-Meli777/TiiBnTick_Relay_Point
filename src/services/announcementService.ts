import apiClient from "@/lib/axios";
export interface AnnouncementResponseDTO {
  id: string;
  status: string;
  [key: string]: any;
}
export interface SubscriptionResponseDTO {
  subscriptionId: string;
  deliveryPersonId: string;
  [key: string]: any;
}

export const getAnnouncementByClientId = async (
  clientId: string,
): Promise<any[]> => [];
export const deleteAnnouncement = async (id: string): Promise<void> => {};
export const publishAnnouncement = async (id: string): Promise<any> => ({});
export const updateAnnouncement = async (
  id: string,
  payload: any,
): Promise<any> => ({});
export const getSubscriptions = async (annId: string): Promise<any[]> => [];
export const assignDeliveryPerson = async (
  annId: string,
  devId: string,
): Promise<any> => ({});
export const getPublishedAnnouncements = async (): Promise<any[]> => [];
export const getDeliveryPersonSubscriptions = async (
  id: string,
): Promise<any[]> => [];
export const createAnnouncement = async (payload: any): Promise<any> => ({
  id: `ANN-${Date.now()}`,
});
