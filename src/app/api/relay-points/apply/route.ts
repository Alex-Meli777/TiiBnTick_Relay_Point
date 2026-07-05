import { NextRequest, NextResponse } from "next/server";
import { applyForRelayPoint } from "@/lib/relayData";
import type { RelayPointApplication } from "@/types/relayPoint";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RelayPointApplication;
    if (
      !body.applicantName ||
      !body.applicantPhone ||
      !body.businessName ||
      !body.city
    ) {
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
