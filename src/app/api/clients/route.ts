import { NextRequest, NextResponse } from "next/server";
import { getMutableDB } from "@/mocks/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const db = getMutableDB();

    const newUser = {
      id: `client-${Date.now()}`,
      email: data.email,
      password: data.password, // Passed from clientService.ts
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      userType: "CLIENT" as const,
    };

    db.users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }
}
