import { NextRequest, NextResponse } from "next/server";
import {
  searchRelayPoints,
  createRelayPoint,
  findRelayPointManager,
  createRelayPointManager,
} from "@/lib/relayData";
import { relayPointSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = parseFloat(searchParams.get("latitude") ?? "");
  const longitude = parseFloat(searchParams.get("longitude") ?? "");

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { success: false, error: "latitude et longitude requis" },
      { status: 400 }
    );
  }

  const radiusKm = parseFloat(searchParams.get("radiusKm") ?? "5");
  const onlyAvailable = searchParams.get("onlyAvailable") === "true";

  const results = searchRelayPoints({
    latitude,
    longitude,
    radiusKm,
    onlyAvailable,
  });

  return NextResponse.json({ success: true, data: results });
}

export async function POST(request: NextRequest) {
  const adminToken = request.cookies.get("auth_token")?.value;
  if (!adminToken) {
    return NextResponse.json(
      { success: false, error: "Non autorisé — admin requis" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = relayPointSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      },
      { status: 400 }
    );
  }

  // Ensure optional fields coming from the schema satisfy the RelayPoint runtime shape
  const payload = {
    ...parsed.data,
    lieuDit: parsed.data.lieuDit ?? "",
  };

  const point = createRelayPoint(payload as any);

  const managerPayload = body?.manager;
  if (
    managerPayload &&
    managerPayload.firstName &&
    managerPayload.lastName &&
    managerPayload.phone &&
    managerPayload.email &&
    managerPayload.password
  ) {
    let manager = findRelayPointManager({
      email: managerPayload.email,
      phone: managerPayload.phone,
    });
    if (!manager) {
      manager = createRelayPointManager({
        firstName: managerPayload.firstName,
        lastName: managerPayload.lastName,
        phone: managerPayload.phone,
        email: managerPayload.email,
        password: managerPayload.password,
      });
    }
    if (!manager.managedRelayPointIds.includes(point.id)) {
      manager.managedRelayPointIds.push(point.id);
    }
    point.managerId = manager.id;
  }

  return NextResponse.json({ success: true, data: point }, { status: 201 });
}
