import { notifyAll, notifyUser } from "@/lib/notificationHub";
import { deliveryStore } from "@/lib/stores/deliveryStore";

// Implements the NotificationService to avoid the domain-calling-system anti-pattern
export const notificationService = {
  notifyDeliveryTeam: async (deliveryId: string) => {
    // Try to include full announcement payload so clients don't need to re-GET from potentially different server instances
    const delivery = deliveryStore.findById(deliveryId as string) as any;
    const announcement = delivery
      ? {
          id: delivery.id,
          title: delivery.contains?.designation || delivery.contains?.description || "Colis",
          description: delivery.contains?.description || "",
          status: delivery.status,
          amount: delivery.contains?.weight ? parseFloat(delivery.contains.weight) * 300 + 1500 : 1500,
          pickupAddress: delivery.sender?.locatedAt,
          deliveryAddress: delivery.recipient?.locatedAt,
          recipientFirstName: delivery.recipient?.name,
        }
      : undefined;

    const payload: any = {
      type: "NEW_DELIVERY",
      announcementId: deliveryId,
      deliveryId,
      announcement,
      message: "Une nouvelle livraison est disponible.",
    };
    notifyAll(payload);
    console.log(`[NOTIF] Delivery ${deliveryId} created. Notifying delivery team...`);
    return { sent: true };
  },
  notifyClient: async (
    requestId: string,
    clientId?: string,
    deliveryId?: string,
    deliverId?: string,
    requestObj?: any,
  ) => {
    const payload: any = {
      type: "DELIVER_REQUEST",
      requestId,
      deliveryId,
      deliverId,
      request: requestObj,
      message: "Un livreur a postulé pour votre livraison.",
    };
    if (clientId) {
      notifyUser(clientId, payload);
    } else {
      notifyAll(payload);
    }
    console.log(`[NOTIF] Client ${clientId ?? "<all>"} notified of new DeliverRequest ${requestId}`);
    return { sent: true };
  },
  notifyDeliver: async (requestId: string, deliverId?: string, deliveryId?: string, requestObj?: any, deliveryObj?: any) => {
    const payload: any = {
      type: "REQUEST_ACCEPTED",
      requestId,
      deliverId,
      deliveryId,
      request: requestObj,
      delivery: deliveryObj,
      message: "Votre demande de livraison a été acceptée.",
    };
    if (deliverId) {
      notifyUser(deliverId, payload);
    } else {
      notifyAll(payload);
    }
    console.log(`[NOTIF] Deliver ${deliverId ?? "<all>"} notified that request ${requestId} was ACCEPTED`);
    return { sent: true };
  },
};
