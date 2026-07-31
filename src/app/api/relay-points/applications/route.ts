import { NextRequest, NextResponse } from "next/server";
import { listApplications } from "@/lib/relayData";
import type { StoredRelayPointApplication } from "@/types/relayPoint";

export async function GET(request: NextRequest) {
  const adminToken = request.cookies.get("auth_token")?.value;
  if (!adminToken) {
    return NextResponse.json(
      { success: false, error: "Non autorisé — admin requis" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as
    | StoredRelayPointApplication["status"]
    | null;

  const applications = listApplications(status ?? undefined);
  return NextResponse.json({ success: true, data: applications });
}
