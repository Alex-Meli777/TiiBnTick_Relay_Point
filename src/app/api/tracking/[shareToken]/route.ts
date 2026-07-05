import { NextRequest, NextResponse } from "next/server";
import {
  getTrackingByToken,
  updateTrackingPosition,
} from "@/lib/relayData";

export async function GET(
  _request: Request,
  { params }: { params: { shareToken: string } }
) {
  const session = getTrackingByToken(params.shareToken);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Lien de suivi expiré ou introuvable" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: session });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { shareToken: string } }
) {
  try {
    const body = await request.json();
    const session = updateTrackingPosition(
      params.shareToken,
      Number(body.latitude),
      Number(body.longitude)
    );
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session expirée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: session });
  } catch {
    return NextResponse.json(
      { success: false, error: "Données invalides" },
      { status: 400 }
    );
  }
}
