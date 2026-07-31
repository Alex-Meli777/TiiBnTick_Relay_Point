// ----- ./src/services/announcementService.ts -----
import apiClient from "@/lib/axios";

export interface AnnouncementResponseDTO {
  id: string;
  status: string;
  title: string;
  amount: number;
  description?: string;
  pickupAddress?: any;
  deliveryAddress?: any;
  [key: string]: any;
}

export interface SubscriptionResponseDTO {
  subscriptionId: string;
  deliveryPersonId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  rating?: number;
}

// Fetch all deliveries created by this client
export const getAnnouncementByClientId = async (
  clientId: string,
): Promise<AnnouncementResponseDTO[]> => {
  try {
    const res = await apiClient.get("/api/deliveries");
    if (res.data && res.data.success) {
      return res.data.data
        .filter((d: any) => d.clientId === clientId)
        .map((d: any) => ({
          id: d.id,
          title: d.contains.designation || "Colis",
          description: d.contains.description || "",
          status: d.status,
          amount: d.contains.weight
            ? parseFloat(d.contains.weight) * 300 + 1500
            : 1500,
          pickupAddress: d.sender.locatedAt,
          deliveryAddress: d.recipient.locatedAt,
          recipientFirstName: d.recipient.name.split(" ")[0] || "",
          recipientLastName: d.recipient.name.split(" ").slice(1).join(" ") || "",
          recipientPhone: d.recipient.phone,
          recipientEmail: d.recipient.email || "",
          shipperFirstName: d.sender.name.split(" ")[0] || "",
          shipperLastName: d.sender.name.split(" ").slice(1).join(" ") || "",
          shipperPhone: d.sender.phone,
          shipperEmail: d.sender.email || "",
          clientId: d.clientId,
        }));
    }
    return [];
  } catch (e) {
    console.error("Error fetching client announcements:", e);
    return [];
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/announcements/${id}`);
};

export const publishAnnouncement = async (id: string): Promise<any> => {
  const res = await apiClient.put(`/api/announcements/${id}`, {
    status: "PUBLISHED",
  });
  return res.data;
};

export const updateAnnouncement = async (
  id: string,
  payload: any,
): Promise<any> => {
  const res = await apiClient.put(`/api/announcements/${id}`, payload);
  return res.data;
};

// Fetch deliverer requests (subscriptions) for a specific delivery order
export const getSubscriptions = async (
  annId: string,
): Promise<SubscriptionResponseDTO[]> => {
  try {
    const res = await apiClient.get("/api/deliver-requests");
    if (res.data && res.data.success) {
      const requests = res.data.data.filter((r: any) => r.deliveryId === annId);

      // Map raw requests to subscriber profile DTOs
      return requests.map((r: any) => ({
        subscriptionId: r.id,
        deliveryPersonId: r.deliverId,
        firstName: "Livreur",
        lastName: r.deliverId.substring(0, 6),
        phone: "699000000",
        email: "livreur@platform.com",
        rating: 4.8,
      }));
    }
    return [];
  } catch (e) {
    console.error("Error fetching subscriptions:", e);
    return [];
  }
};

export const assignDeliveryPerson = async (
  annId: string,
  devId: string,
): Promise<any> => {
  const res = await apiClient.put(`/api/deliver-requests/${annId}/accept`);
  return res.data;
};

// Fetch deliveries with "PENDING" status
export const getPublishedAnnouncements = async (): Promise<
  AnnouncementResponseDTO[]
> => {
  try {
    const res = await apiClient.get("/api/deliveries");
    if (res.data && res.data.success) {
      return res.data.data
        .filter((d: any) => d.status === "PENDING")
        .map((d: any) => ({
          id: d.id,
          title: d.contains.designation || "Colis",
          description: d.contains.description || "",
          status: d.status,
          amount: d.contains.weight
            ? parseFloat(d.contains.weight) * 300 + 1500
            : 1500,
          pickupAddress: d.sender.locatedAt,
          deliveryAddress: d.recipient.locatedAt,
          recipientFirstName: d.recipient.name,
          recipientPhone: d.recipient.phone,
        }));
    }
    return [];
  } catch (e) {
    console.error("Error in getPublishedAnnouncements:", e);
    return [];
  }
};

// Fetch deliveries currently assigned to a deliverer
export const getDeliveryPersonSubscriptions = async (
  id: string,
): Promise<any[]> => {
  try {
    const res = await apiClient.get("/api/deliveries");
    if (res.data && res.data.success) {
      return res.data.data
        .filter((d: any) => d.assignedTo === id)
        .map((d: any) => ({
          id: d.id,
          title: d.contains.designation || "Colis",
          status: d.status,
          pickupAddress: d.sender.locatedAt,
          deliveryAddress: d.recipient.locatedAt,
        }));
    }
    return [];
  } catch (e) {
    console.error("Error getting deliverer subscriptions:", e);
    return [];
  }
};

export const createAnnouncement = async (payload: any): Promise<any> => {
  const res = await apiClient.post("/api/deliveries", payload);
  return res.data;
};
