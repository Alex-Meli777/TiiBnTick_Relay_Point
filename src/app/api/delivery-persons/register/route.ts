import { NextRequest, NextResponse } from "next/server";
import { getMutableDB } from "@/mocks/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Master branch sends a Blob/File named 'data' containing the JSON string
    const dataBlob = formData.get("data") as Blob;
    const dataText = await dataBlob.text();
    const parsedData = JSON.parse(dataText);

    const db = getMutableDB();

    const newUser = {
      id: `livreur-${Date.now()}`,
      email: parsedData.email,
      password: parsedData.password,
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      phone: parsedData.phone,
      userType: "LIVREUR" as const,
    };

    db.users.push(newUser);

    return NextResponse.json(
      { success: true, message: "Livreur enregistré" },
      { status: 201 },
    );
  } catch (e) {
    console.error("Registration error:", e);
    return NextResponse.json(
      { message: "Données d'inscription invalides" },
      { status: 400 },
    );
  }
}
