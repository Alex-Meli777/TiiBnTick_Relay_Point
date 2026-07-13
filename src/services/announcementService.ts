// ----- ./src/services/announcementService.ts -----
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

// Helper function to map unified backend Delivery DTOs to UI AnnouncementResponseDTOs
function mapDeliveryToAnnouncement(delivery: any): AnnouncementResponseDTO {
  return {
    id: delivery.id,
    title: delivery.contains?.designation || "Colis sans titre",
    description: delivery.contains?.description || "",
    status: delivery.status,
    amount: delivery.contains?.weight
      ? parseFloat(delivery.contains.weight) * 300 + 1500
      : 1500,
    distance: 5.5, // Standard mock value
    duration: 15, // Standard mock value
    createdAt: delivery.createdAt,
    pickupAddress: {
      street: delivery.sender?.locatedAt?.street || "",
      city: delivery.sender?.locatedAt?.city || "Yaoundé",
      district: delivery.sender?.locatedAt?.street || "",
    },
    deliveryAddress: {
      street: delivery.recipient?.locatedAt?.street || "",
      city: delivery.recipient?.locatedAt?.city || "Yaoundé",
      district: delivery.recipient?.locatedAt?.street || "",
    },
    packet: {
      designation: delivery.contains?.designation || "",
      description: delivery.contains?.description || "",
      weight: delivery.contains?.weight || "0",
      photoPacket: null,
    },
    assignedDeliveryPersonFirstName: delivery.assignedTo ? "Paul" : null,
    assignedDeliveryPersonLastName: delivery.assignedTo ? "Livreur" : null,
    assignedDeliveryPersonPhone: delivery.assignedTo ? "699000002" : null,
    assignedDeliveryPersonEmail: delivery.assignedTo
      ? "livreur@test.com"
      : null,
  };
}

export const getAnnouncementByClientId = async (
  clientId: string,
): Promise<AnnouncementResponseDTO[]> => {
  try {
    const response = await apiClient.get("/api/deliveries");
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data.map(mapDeliveryToAnnouncement);
    }
    return [];
  } catch (error) {
    console.error("Error fetching announcements for client:", error);
    return [];
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/deliveries/${id}`);
};

export const publishAnnouncement = async (id: string): Promise<any> => {
  const response = await apiClient.put(`/api/deliveries/${id}`, {
    status: "PENDING",
  });
  return response.data;
};

export const updateAnnouncement = async (
  id: string,
  payload: any,
): Promise<any> => {
  const response = await apiClient.put(`/api/deliveries/${id}`, payload);
  return response.data;
};

export const getSubscriptions = async (
  annId: string,
): Promise<SubscriptionResponseDTO[]> => {
  try {
    const response = await apiClient.get("/api/deliver-requests");
    if (response.data?.success && Array.isArray(response.data.data)) {
      const candidates = response.data.data.filter(
        (req: any) => req.deliveryId === annId,
      );
      return candidates.map((c: any) => ({
        subscriptionId: c.id,
        deliveryPersonId: c.deliverId,
        firstName: "Paul",
        lastName: "Livreur",
        phone: "699000002",
        email: "livreur@test.com",
        rating: 4.8,
      }));
    }
    return [];
  } catch {
    return [];
  }
};

export const assignDeliveryPerson = async (
  annId: string,
  devId: string,
): Promise<any> => {
  const response = await apiClient.get("/api/deliver-requests");
  if (response.data?.success && Array.isArray(response.data.data)) {
    const match = response.data.data.find(
      (req: any) => req.deliveryId === annId && req.deliverId === devId,
    );
    if (match) {
      const acceptRes = await apiClient.put(
        `/api/deliver-requests/${match.id}/accept`,
      );
      return acceptRes.data;
    }
  }
  throw new Error("No active delivery request found to assign.");
};

export const getPublishedAnnouncements = async (): Promise<
  AnnouncementResponseDTO[]
> => {
  try {
    const response = await apiClient.get("/api/deliveries");
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((d: any) => d.status === "PENDING")
        .map(mapDeliveryToAnnouncement);
    }
    return [];
  } catch {
    return [];
  }
};

export const getDeliveryPersonSubscriptions = async (
  id: string,
): Promise<AnnouncementResponseDTO[]> => {
  try {
    const response = await apiClient.get("/api/deliveries");
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((d: any) => d.assignedTo === id)
        .map(mapDeliveryToAnnouncement);
    }
    return [];
  } catch {
    return [];
  }
};

export const createAnnouncement = async (payload: any): Promise<any> => {
  const response = await apiClient.post("/api/deliveries", payload);
  return response.data;
};
