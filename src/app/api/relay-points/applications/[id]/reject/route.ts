import { NextRequest, NextResponse } from "next/server";
import { rejectApplication } from "@/lib/relayData";

export async function POST(
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

  const ok = rejectApplication(params.id);
  if (!ok) {
    return NextResponse.json(
      {
        success: false,
        error: "Candidature introuvable ou déjà traitée",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
