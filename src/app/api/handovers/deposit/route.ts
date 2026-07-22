import { NextRequest, NextResponse } from "next/server";
import { depositParcel } from "@/lib/relayData";
import type { DepositRequest } from "@/types/relayPoint";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DepositRequest;
    if (!body.trackingNumber || !body.relayPointId || !body.driverId) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const parcel = depositParcel(body);
    if (!parcel) {
      return NextResponse.json(
        {
          success: false,
          error: "Dépôt impossible — colis introuvable, statut invalide ou point plein",
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
