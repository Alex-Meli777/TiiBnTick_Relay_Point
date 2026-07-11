import { NextRequest, NextResponse } from "next/server";
import { getMutableDB } from "@/mocks/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = getMutableDB();

    // Find the user in our simulated database
    const user = db.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { message: "Identifiants incorrects" },
        { status: 401 },
      );
    }

    // Return exactly what the AuthContext expects
    return NextResponse.json({
      token: "mock-jwt-" + user.id,
      id: user.id,
      clientId: user.userType === "CLIENT" ? user.id : undefined,
      deliveryPersonId: user.userType === "LIVREUR" ? user.id : undefined,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      isActive: true,
    });
  } catch (e) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
