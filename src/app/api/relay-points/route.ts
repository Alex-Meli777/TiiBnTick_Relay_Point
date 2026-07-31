import { NextRequest, NextResponse } from "next/server";
import {
  searchRelayPoints,
  createRelayPoint,
  findRelayPointManager,
  createRelayPointManager,
  getRelayPointManagerById,
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

  // Normalize admin-submitted application-shaped payloads (from the shared form)
  // The front-end uses `businessName` and `manager` fields; relayPointSchema expects `name` and owner* fields.
  let ownerFromManager: { name?: string; phone?: string; email?: string } | undefined;
  if (body?.businessName && typeof body?.managerId === "string") {
    const linked = getRelayPointManagerById(body.managerId);
    if (linked) {
      ownerFromManager = {
        name: linked.fullName || `${linked.firstName} ${linked.lastName}`,
        phone: linked.phone,
        email: linked.email ?? "",
      };
    }
  }

  const toValidate = (body && typeof body === "object")
    ? (body.businessName
        ? {
            name: body.businessName,
            type: body.type,
            country: body.country,
            region: body.region,
            city: body.city,
            address: body.address,
            lieuDit: body.lieuDit ?? "",
            latitude: Number(body.latitude),
            longitude: Number(body.longitude),
            ownerName: ownerFromManager?.name ?? (body.manager ? `${body.manager.firstName} ${body.manager.lastName}` : body.ownerName),
            ownerPhone: ownerFromManager?.phone ?? (body.manager ? body.manager.phone : body.ownerPhone),
            ownerEmail: ownerFromManager?.email ?? (body.manager ? body.manager.email ?? "" : body.ownerEmail ?? ""),
            openingHours: body.openingHours,
            capacity: Number(body.capacity),
            currentLoad: Number(body.currentLoad ?? 0),
            handlingFee: Number(body.handlingFee ?? 0),
            status: body.status,
            photos: body.photos,
          }
        : body)
    : body;

  const parsed = relayPointSchema.safeParse(toValidate);
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

  const managerId = typeof body?.managerId === "string" ? body.managerId : undefined;
  const managerPayload = body?.manager;
  let manager;

  if (managerId) {
    manager = getRelayPointManagerById(managerId);
    if (!manager) {
      return NextResponse.json(
        { success: false, error: "Gestionnaire introuvable" },
        { status: 400 }
      );
    }
  } else if (
    managerPayload &&
    managerPayload.firstName &&
    managerPayload.lastName &&
    managerPayload.phone &&
    managerPayload.email
  ) {
    manager = findRelayPointManager({
      email: managerPayload.email,
      phone: managerPayload.phone,
    });
    if (!manager) {
      manager = createRelayPointManager({
        firstName: managerPayload.firstName,
        lastName: managerPayload.lastName,
        phone: managerPayload.phone,
        email: managerPayload.email,
        password: managerPayload.password || "",
      });
    }
  }

  if (manager) {
    if (!manager.managedRelayPointIds.includes(point.id)) {
      manager.managedRelayPointIds.push(point.id);
    }
    point.managerId = manager.id;
  }

  return NextResponse.json({ success: true, data: point }, { status: 201 });
}
