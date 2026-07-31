import { NextRequest, NextResponse } from "next/server";
import { pickupParcel } from "@/lib/relayData";
import type { PickupRequest } from "@/types/relayPoint";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PickupRequest;
    if (!body.trackingNumber || !body.relayPointId || !body.recipientOtp) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const parcel = pickupParcel(body);
    if (!parcel) {
      return NextResponse.json(
        {
          success: false,
          error: "Retrait impossible — colis introuvable, statut invalide ou OTP incorrect",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: parcel });
  } catch {
    return NextResponse.json(
      { success: false, error: "Données invalides" },
      { status: 400 }
    );
  }
}
