import { NextRequest, NextResponse } from "next/server";
import { activateTracking } from "@/lib/relayData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingNumber, driverLatitude, driverLongitude } = body;

    if (!trackingNumber || driverLatitude == null || driverLongitude == null) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const session = activateTracking(
      trackingNumber,
      Number(driverLatitude),
      Number(driverLongitude)
    );

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Colis introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Données invalides" },
      { status: 400 }
    );
  }
}
