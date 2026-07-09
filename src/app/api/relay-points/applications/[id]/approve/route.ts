import { NextRequest, NextResponse } from "next/server";
import { approveApplication } from "@/lib/relayData";
import { approveApplicationSchema } from "@/lib/schemas";

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

  const rawBody = await request.json().catch(() => undefined);
  const parsed = approveApplicationSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      },
      { status: 400 }
    );
  }

  const point = approveApplication(params.id, parsed.data);
  if (!point) {
    return NextResponse.json(
      {
        success: false,
        error: "Candidature introuvable ou déjà traitée",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: point }, { status: 201 });
}
