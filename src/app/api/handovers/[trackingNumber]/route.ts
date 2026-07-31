import { NextResponse } from "next/server";
import { getHandoverEvents } from "@/lib/relayData";

export async function GET(
  _request: Request,
  { params }: { params: { trackingNumber: string } }
) {
  const events = getHandoverEvents(params.trackingNumber);
  return NextResponse.json({ success: true, data: events });
}
