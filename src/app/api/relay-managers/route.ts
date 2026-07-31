import { NextResponse } from "next/server";
import { getRelayManagers } from "@/lib/relayData";

export async function GET() {
  const managers = getRelayManagers();
  return NextResponse.json({ success: true, data: managers });
}
