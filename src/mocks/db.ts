import { Delivery } from "@/types/delivery";
import { DeliverRequest } from "@/types/deliverRequest";
import { RelayPoint } from "@/types/relayPoint";

export const db = {
  // --- ADDED USERS ARRAY ---
  users: [
    {
      id: "client-demo",
      email: "client@test.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Client",
      phone: "600000001",
      userType: "CLIENT" as const,
    },
    {
      id: "livreur-demo",
      email: "livreur@test.com",
      password: "password123",
      firstName: "Paul",
      lastName: "Livreur",
      phone: "600000002",
      userType: "LIVREUR" as const,
    },
  ],
  deliveries: [] as Delivery[],
  requests: [] as DeliverRequest[],
  relayPoints: [
    {
      id: "rp-dla-001",
      name: "Boutique Mama Ngo",
      capacity: 40,
      currentLoad: 12,
      handlingFee: 500,
      status: "active",
        address: "Rue Joss",
        lieuDit: "Quartier Bonamoussadi",
        city: "Douala",
        region: "Littoral",
        country: "Cameroun",
        latitude: 4.0511,
        longitude: 9.7085,
    },
  ] as RelayPoint[],
};

export function getMutableDB() {
  const globalStore = globalThis as any;
  if (!globalStore.__tbtDB) {
    globalStore.__tbtDB = db;
  }
  return globalStore.__tbtDB as typeof db;
}
