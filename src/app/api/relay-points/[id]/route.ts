import { NextResponse } from "next/server";
import { getRelayPointById } from "@/lib/relayData";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const point = getRelayPointById(params.id);
  if (!point) {
    return NextResponse.json(
      { success: false, error: "Point relais introuvable" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: point });
}
