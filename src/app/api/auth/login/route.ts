// ----- ./src/app/api/auth/login/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import { getMutableDB } from "@/mocks/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = getMutableDB();

    // 1. Search for user in mock database
    const user = db.users.find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      // Create a fallback user if they didn't register first to facilitate testing
      const isLivreur =
        email.toLowerCase().includes("livreur") ||
        email.toLowerCase().includes("deliver");
      const isAdmin = email.toLowerCase().includes("admin");
      const detectedType = isAdmin ? "ADMIN" : isLivreur ? "LIVREUR" : "CLIENT";

      const fallbackUser = {
        id: `usr-${Date.now()}`,
        clientId:
          detectedType === "CLIENT" ? `client-${Date.now()}` : undefined,
        deliveryPersonId:
          detectedType === "LIVREUR" ? `livreur-${Date.now()}` : undefined,
        email: email,
        password: password || "password123",
        firstName: email.split("@")[0],
        lastName: "Demo",
        phone: "699000000",
        userType: detectedType,
      };

      // Persist user in db so subsequent API calls find them
      db.users.push(fallbackUser);

      return NextResponse.json(
        {
          ...fallbackUser,
          token: "mock-jwt-token-fallback",
        },
        { status: 200 },
      );
    }

    // 2. Return found user matching credentials
    return NextResponse.json(
      {
        ...user,
        clientId:
          user.clientId || (user.userType === "CLIENT" ? user.id : undefined),
        deliveryPersonId:
          user.deliveryPersonId ||
          (user.userType === "LIVREUR" ? user.id : undefined),
        token: "mock-jwt-token",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la tentative de connexion." },
      { status: 500 },
    );
  }
}
