// ----- ./src/mocks/db.ts -----
import { Delivery } from "@/types/delivery";
import { DeliverRequest } from "@/types/deliverRequest";
import { RelayPoint } from "@/types/relayPoint";

export interface MockDB {
  users: any[];
  deliveries: Delivery[];
  requests: DeliverRequest[];
  relayPoints: RelayPoint[];
}

export const initialDBState: MockDB = {
  users: [
    {
      id: "client-demo",
      email: "client@test.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Client",
      phone: "699000001",
      userType: "CLIENT",
      clientId: "client-demo",
    },
    {
      id: "livreur-demo",
      email: "livreur@test.com",
      password: "password123",
      firstName: "Paul",
      lastName: "Livreur",
      phone: "699000002",
      userType: "LIVREUR",
      deliveryPersonId: "livreur-demo",
    },
  ],
  deliveries: [],
  requests: [],
  relayPoints: [
    {
      id: "rp-yde-001",
      name: "Boutique Mama Ngo - Bastos",
      type: "shop",
      country: "Cameroun",
      region: "Centre",
      city: "Yaoundé",
      address: "Rue Bastos",
      lieuDit: "Face Pharmacie du Rond Point",
      latitude: 3.8794,
      longitude: 11.5174,
      ownerName: "Mama Ngo",
      ownerPhone: "677112233",
      openingHours: [{ day: "mon", open: "08:00", close: "20:00" }],
      capacity: 30,
      currentLoad: 4,
      handlingFee: 500,
      status: "active",
    },
  ],
};

export function getMutableDB(): MockDB {
  const globalStore = globalThis as any;
  if (!globalStore.__tbtDB) {
    globalStore.__tbtDB = { ...initialDBState };
  }
  return globalStore.__tbtDB;
}
