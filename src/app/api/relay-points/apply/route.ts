import { NextRequest, NextResponse } from "next/server";
import { applyForRelayPoint, findRelayPointManager } from "@/lib/relayData";
import type { RelayPointApplication } from "@/types/relayPoint";

function validateApplication(body: any): body is RelayPointApplication {
  const hasManagerIdentity =
    body?.manager?.firstName &&
    body?.manager?.lastName &&
    body?.manager?.phone &&
    body?.manager?.email;

  const managerExists = hasManagerIdentity
    ? Boolean(
        findRelayPointManager({
          email: body.manager.email,
          phone: body.manager.phone,
        })
      )
    : false;

  return (
    hasManagerIdentity &&
    (managerExists || body?.manager?.password) &&
    body?.businessName &&
    body?.type &&
    body?.country &&
    body?.region &&
    body?.city &&
    body?.address &&
    typeof body?.latitude === "number" &&
    typeof body?.longitude === "number" &&
    typeof body?.capacity === "number" &&
    typeof body?.handlingFee === "number"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!validateApplication(body)) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }
    const application = applyForRelayPoint(body);
    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Données invalides" },
      { status: 400 }
    );
  }
}
