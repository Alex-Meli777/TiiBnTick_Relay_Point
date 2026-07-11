import { Delivery } from "@/types/delivery";

// In-memory DeliveryRepository
export const deliveryStore = {
  deliveries: [] as Delivery[],

  save: (delivery: Delivery) => {
    deliveryStore.deliveries.push(delivery);
    return delivery;
  },

  findById: (id: string) => {
    return deliveryStore.deliveries.find((d) => d.id === id);
  },

  update: (id: string, updates: Partial<Delivery>) => {
    const index = deliveryStore.deliveries.findIndex((d) => d.id === id);
    if (index > -1) {
      deliveryStore.deliveries[index] = {
        ...deliveryStore.deliveries[index],
        ...updates,
      };
      return deliveryStore.deliveries[index];
    }
    return null;
  },
};
