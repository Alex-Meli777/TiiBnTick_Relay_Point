// ----- ./src/mocks/db.ts -----
import { Delivery } from "@/types/delivery";
import { DeliverRequest } from "@/types/deliverRequest";
// NEW imports for Relay Point related entities
import {
  RelayPoint,
  RelayPointPricingPolicy,
  RelayPointManager,
  StoredRelayPointApplication,
} from "@/types/relayPoint";
import {
  initialRelayPoints,
  relayManagers,
  initialRelayPointPricingPolicies,
  initialApplications,
} from "@/mocks/relayPointsSeed"; 

export interface MockDB {
  users: any[];
  deliveries: Delivery[];
  requests: DeliverRequest[];
  relayPoints: RelayPoint[]; // Use the updated RelayPoint type
  relayPointPricingPolicies: RelayPointPricingPolicy[]; // NEW: For pricing policies
  relayManagers: RelayPointManager[]; // NEW: For managing managers
  relayApplications: StoredRelayPointApplication[]; // NEW: For pending applications
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
      id: "livreur-demo", // This is a generic freelancer
      email: "livreur@test.com",
      password: "password123",
      firstName: "Paul",
      lastName: "Livreur",
      phone: "699000002",
      userType: "LIVREUR",
      deliveryPersonId: "livreur-demo",
      nationalId: "GENERICLIVREUR", // Added required field
      commercialName: "Livreur Express", // Added required field
    },
    // Map RelayPointManagers into the main 'users' array so they can log in as 'LIVREUR'
    // This assumes RelayPointManager is conceptually a Freelancer
    ...relayManagers.map((mgr) => ({
      id: mgr.id,
      email: mgr.email,
      password: mgr.password,
      firstName: mgr.firstName,
      lastName: mgr.lastName,
      phone: mgr.phone,
      userType: "LIVREUR", // Relay managers are considered LIVREURs/Freelancers
      deliveryPersonId: mgr.id, // Their freelancer ID is their manager ID
      nationalId: mgr.nationalId, // Include for full freelancer profile
      nui: mgr.nui, // Include for full freelancer profile
      commercialName: mgr.fullName, // Commercial name for freelancer profile
    })),
  ],
  deliveries: [],
  requests: [],
  relayPoints: [
    ...initialRelayPoints, // new seeded relay points
  ],
  relayPointPricingPolicies: [
    ...initialRelayPointPricingPolicies, // new seeded pricing policies
  ],
  relayManagers: [
    ...relayManagers, // new seeded relay managers
  ],
  relayApplications: [
    ...initialApplications, // new seeded relay applications
  ],
};

export function getMutableDB(): MockDB {
  const globalStore = globalThis as any;
  if (!globalStore.__tbtDB) {
    // Deep copy to prevent unintended shared references if not doing so already
    globalStore.__tbtDB = JSON.parse(JSON.stringify(initialDBState));
  }
  return globalStore.__tbtDB;
}
