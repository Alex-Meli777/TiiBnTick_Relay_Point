import { NextRequest, NextResponse } from "next/server";
import { relayOwnerCredentials } from "@/mocks/relayPointsSeed";
import { signRelayToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");

    const owner = relayOwnerCredentials.find(
      (o) => o.phone === phone && o.password === password
    );

    if (!owner) {
      return NextResponse.json(
        { success: false, error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const token = await signRelayToken({
      sub: owner.id,
      fullName: owner.fullName,
      phone: owner.phone,
      managedRelayPointIds: owner.managedRelayPointIds,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        fullName: owner.fullName,
        managedRelayPointIds: owner.managedRelayPointIds,
      },
    });

    response.cookies.set("relay_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Données invalides" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { loggedOut: true } });
  response.cookies.set("relay_auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
