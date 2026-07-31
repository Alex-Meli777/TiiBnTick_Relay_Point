import { DeliverRequest } from "@/types/deliverRequest";

// In-memory DeliverRequestRepository
export const deliverRequestStore = {
  requests: [] as DeliverRequest[],

  save: (request: DeliverRequest) => {
    deliverRequestStore.requests.push(request);
    return request;
  },

  findById: (id: string) => {
    return deliverRequestStore.requests.find((r) => r.id === id);
  },

  findByDeliveryId: (deliveryId: string) => {
    return deliverRequestStore.requests.filter(
      (r) => r.deliveryId === deliveryId,
    );
  },
};
