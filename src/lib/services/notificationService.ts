// Implements the NotificationService to avoid the domain-calling-system anti-pattern
export const notificationService = {
  notifyDeliveryTeam: async (deliveryId: string) => {
    console.log(
      `[NOTIF] Delivery ${deliveryId} created. Notifying delivery team...`,
    );
    return { sent: true };
  },
  notifyClient: async (requestId: string) => {
    console.log(`[NOTIF] Client notified of new DeliverRequest ${requestId}`);
    return { sent: true };
  },
  notifyDeliver: async (requestId: string) => {
    console.log(
      `[NOTIF] Deliver notified that their request ${requestId} was ACCEPTED`,
    );
    return { sent: true };
  },
};
