// ----- ./src/app/api/deliveries/[id]/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import { deliveryStore } from "@/lib/stores/deliveryStore";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id || params.id === "undefined") {
    return NextResponse.json({ success: true, data: null });
  }
  const delivery = deliveryStore.findById(params.id);
  if (!delivery) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: delivery });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const updated = deliveryStore.update(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Delivery not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Invalid updates" },
      { status: 400 },
    );
  }
}
