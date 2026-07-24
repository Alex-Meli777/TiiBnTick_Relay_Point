import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRelayToken } from "@/lib/jwt";
import { getRelayPointById, findRelayPointManager } from "@/lib/relayData";

export async function GET() {
  const token = cookies().get("relay_auth_token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Non authentifié" },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyRelayToken(token);
    const relayPoints = payload.managedRelayPointIds
      .map(getRelayPointById)
      .filter(Boolean);
    const manager = findRelayPointManager({ phone: payload.phone });

    return NextResponse.json({
      success: true,
      data: {
        id: payload.sub,
        fullName: payload.fullName,
        phone: payload.phone,
        email: manager?.email,
        managedRelayPointIds: payload.managedRelayPointIds,
        relayPoints,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Token invalide" },
      { status: 401 }
    );
  }
}
