import { NextRequest, NextResponse } from "next/server";
import { submitProofOfDelivery } from "@/lib/relayData";
import type { ProofOfDeliverySubmission } from "@/types/relayPoint";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProofOfDeliverySubmission;
    if (!body.trackingNumber || !body.submittedBy) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const ok = submitProofOfDelivery(body);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Colis introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { success: true } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Données invalides" },
      { status: 400 }
    );
  }
}
