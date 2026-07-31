// app/api/relay-points/applications/[id]/validate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { approveApplication, rejectApplication } from "@/lib/relayData";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const { approved, reason, capacity, handlingFee } = body;

  if (approved) {
    const point = approveApplication(params.id, { capacity, handlingFee });
    if (!point)
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, data: point });
  } else {
    const ok = rejectApplication(params.id); // You might want to update rejectApplication in lib/relayData to save the reason
    return NextResponse.json({ success: true });
  }
}
