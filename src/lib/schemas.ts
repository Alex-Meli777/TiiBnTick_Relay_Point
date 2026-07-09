import { z } from "zod";

export const openingHourSchema = z.object({
  day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
  open: z.string(),
  close: z.string(),
});

export const relayPointSchema = z.object({
  name: z.string().min(2, "Le nom est requis (2 caractères minimum)"),
  type: z.enum(["shop", "pharmacy", "kiosk", "official_agency"]),
  country: z.string().min(2, "Le pays est requis"),
  region: z.string().min(2, "La région est requise"),
  city: z.string().min(2, "La ville est requise"),
  address: z.string().min(2, "L'adresse est requise"),
  lieuDit: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  ownerName: z.string().min(2, "Le nom du propriétaire est requis"),
  ownerPhone: z.string().min(6, "Le téléphone du propriétaire est requis"),
  ownerEmail: z.string().email("Email invalide").optional(),
  openingHours: z.array(openingHourSchema).min(1, "Au moins un horaire est requis"),
  capacity: z.number().positive("La capacité doit être positive"),
  currentLoad: z.number().min(0).default(0),
  handlingFee: z.number().min(0),
  status: z
    .enum(["active", "suspended", "pending_validation"])
    .default("active"),
  photos: z.array(z.string()).optional(),
});

export const relayPointUpdateSchema = relayPointSchema.partial();

export const approveApplicationSchema = z
  .object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    capacity: z.number().positive().optional(),
    handlingFee: z.number().min(0).optional(),
    openingHours: z.array(openingHourSchema).optional(),
  })
  .optional();
