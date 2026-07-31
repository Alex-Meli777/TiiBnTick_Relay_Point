import { NextResponse } from "next/server";
import { verifyRelayToken } from "@/lib/jwt";
import {
  getRelayPointById,
  getParcelsByRelayPoint,
  getNotificationsForRelay,
  findRelayPointManager,
} from "@/lib/relayData";
import { cookies } from "next/headers";

async function getOwnerRelayId(
  relayPointId: string
): Promise<boolean> {
  const token = cookies().get("relay_auth_token")?.value;
  if (!token) return false;
  try {
    const payload = await verifyRelayToken(token);
    const manager = findRelayPointManager({ phone: payload.phone });
    if (!manager) return false;
    return manager.managedRelayPointIds.includes(relayPointId);
  } catch {
    return false;
  }
}

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

  const isOwner = await getOwnerRelayId(params.id);
  if (!isOwner) {
    return NextResponse.json(
      { success: false, error: "Accès non autorisé" },
      { status: 403 }
    );
  }

  const parcels = getParcelsByRelayPoint(params.id);
  return NextResponse.json({ success: true, data: parcels });
}
