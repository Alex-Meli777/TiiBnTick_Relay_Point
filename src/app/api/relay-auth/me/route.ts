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
    // Fetch the manager's current state from the store instead of using the token snapshot
    // This ensures newly approved relay points (linked after login) are returned immediately
    const manager = findRelayPointManager({ phone: payload.phone });
    if (!manager) {
      return NextResponse.json(
        { success: false, error: "Gestionnaire non trouvé" },
        { status: 401 }
      );
    }

    const relayPoints = (manager.managedRelayPointIds || [])
      .map(getRelayPointById)
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        id: manager.id,
        fullName: manager.fullName,
        phone: manager.phone,
        email: manager.email,
        managedRelayPointIds: manager.managedRelayPointIds || [],
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
