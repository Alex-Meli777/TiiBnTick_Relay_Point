import { NextRequest, NextResponse } from "next/server";
import {
  getRelayPointById,
  updateRelayPoint,
  deleteRelayPoint,
} from "@/lib/relayData";
import { relayPointUpdateSchema } from "@/lib/schemas";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const point = getRelayPointById(params.id);
  if (!point) {
    return NextResponse.json(
      { success: false, error: "Point relais introuvable" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: point });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminToken = request.cookies.get("auth_token")?.value;
  if (!adminToken) {
    return NextResponse.json(
      { success: false, error: "Non autorisé — admin requis" },
      { status: 401 }
    );
  }

  const existing = getRelayPointById(params.id);
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Point relais introuvable" },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = relayPointUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      },
      { status: 400 }
    );
  }

  const updated = updateRelayPoint(params.id, parsed.data);
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminToken = request.cookies.get("auth_token")?.value;
  if (!adminToken) {
    return NextResponse.json(
      { success: false, error: "Non autorisé — admin requis" },
      { status: 401 }
    );
  }

  const result = deleteRelayPoint(params.id);
  if (!result.deleted) {
    return NextResponse.json(
      { success: false, error: result.error ?? "Suppression impossible" },
      { status: result.error === "Point relais introuvable" ? 404 : 409 }
    );
  }

  return NextResponse.json({ success: true });
}
