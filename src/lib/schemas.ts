import { RelayPointStatusBackend } from "@/types/relayPoint";
import { z } from "zod";

export const relayPointSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["shop", "pharmacy", "kiosk", "official_agency"]),
  country: z.string().min(2),
  region: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(2),
  lieuDit: z.string().optional().or(z.literal("")),
  latitude: z.number(),
  longitude: z.number(),
  ownerName: z.string().min(2),
  ownerPhone: z.string().min(5),
  ownerEmail: z.string().email().optional().or(z.literal("")),
  openingHours: z.array(
    z.object({ day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]), open: z.string(), close: z.string() })
  ).optional(),
  capacity: z.number().int().positive(),
  currentLoad: z.number().int().min(0).optional(),
  handlingFee: z.number().int().nonnegative().optional(),
  status: z.nativeEnum(RelayPointStatusBackend).optional(),
  photos: z.array(z.string()).optional(),
});

export const relayPointUpdateSchema = relayPointSchema.partial().extend({
  id: z.string().optional(),
});

export const approveApplicationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().int().positive().optional(),
  handlingFee: z.number().int().nonnegative().optional(),
  openingHours: z.array(
    z.object({ day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]), open: z.string(), close: z.string() })
  ).optional(),
}).optional();
