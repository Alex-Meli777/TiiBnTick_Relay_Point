// ----- ./src/app/api/deliveries/[id]/relay-point/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import { deliveryStore } from "@/lib/stores/deliveryStore";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updates: any = {};
    if (body.type === "pickup") updates.pickupFrom = body.relayPointId;
    if (body.type === "dropoff") updates.dropOffAt = body.relayPointId;

    const updated = deliveryStore.update(params.id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Delivery not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }
}
