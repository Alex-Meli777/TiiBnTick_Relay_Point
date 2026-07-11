import { RelayPoint } from "@/types/relayPoint";

const SAMPLE_POINTS: RelayPoint[] = [
  {
    id: "r-1",
    name: "Relais Centre",
    type: "shop",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Bastos",
    lieuDit: "Face pharmacie",
    latitude: 3.848,
    longitude: 11.502,
    ownerName: "John",
    ownerPhone: "600000000",
    openingHours: [],
    capacity: 50,
    currentLoad: 12,
    handlingFee: 500,
    status: "active",
  },
  {
    id: "r-2",
    name: "Relais Est",
    type: "pharmacy",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Essos",
    lieuDit: "Camp Sic",
    latitude: 3.854,
    longitude: 11.51,
    ownerName: "Jane",
    ownerPhone: "610000000",
    openingHours: [],
    capacity: 30,
    currentLoad: 5,
    handlingFee: 600,
    status: "active",
  },
  {
    id: "r-3",
    name: "Relais Ouest",
    type: "kiosk",
    country: "Cameroun",
    region: "Centre",
    city: "Yaoundé",
    address: "Mokolo",
    lieuDit: "Marché",
    latitude: 3.842,
    longitude: 11.494,
    ownerName: "Paul",
    ownerPhone: "620000000",
    openingHours: [],
    capacity: 20,
    currentLoad: 18,
    handlingFee: 300,
    status: "active",
  },
];

export const relayPointService = {
  getAllRelayPoints: async (): Promise<RelayPoint[]> => {
    // stub: return sample data
    return Promise.resolve(SAMPLE_POINTS);
  },
};

export default relayPointService;
