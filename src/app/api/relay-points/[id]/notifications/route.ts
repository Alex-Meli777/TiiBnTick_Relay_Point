import { NextResponse } from "next/server";
import { verifyRelayToken } from "@/lib/jwt";
import { getNotificationsForRelay, findRelayPointManager } from "@/lib/relayData";
import { cookies } from "next/headers";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("relay_auth_token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Non authentifié" },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyRelayToken(token);
    const manager = findRelayPointManager({ phone: payload.phone });
    if (!manager || !manager.managedRelayPointIds.includes(params.id)) {
      return NextResponse.json(
        { success: false, error: "Accès refusé" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Token invalide" },
      { status: 401 }
    );
  }

  const notifications = getNotificationsForRelay(params.id);
  return NextResponse.json({ success: true, data: notifications });
}
