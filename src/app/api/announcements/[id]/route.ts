// ----- ./src/app/api/announcements/[id]/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import { deliveryStore } from "@/lib/stores/deliveryStore";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // Catch undefined lookups from connection pings gracefully
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

  const parcelAny = delivery.contains as any;
  const recipientAny = delivery.recipient as any;

  const dto = {
    id: delivery.id,
    title: parcelAny?.designation || parcelAny?.description || "Colis",
    description: parcelAny?.description || "",
    status: delivery.status,
    amount: delivery.contains?.weight
      ? parseFloat(delivery.contains.weight as any) * 300 + 1500
      : 1500,
    pickupAddress: delivery.sender?.locatedAt,
    deliveryAddress: delivery.recipient?.locatedAt,
    recipientFirstName: delivery.recipient?.name?.split(" ")[0] || "",
    recipientLastName:
      delivery.recipient?.name?.split(" ").slice(1).join(" ") || "",
    recipientPhone: delivery.recipient?.phone,
    recipientEmail: recipientAny?.email || "",
  };

  return NextResponse.json({ success: true, data: dto });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ success: true, data: null });
    }
    const body = await req.json();
    const updates: any = {};
    if (body.status) updates.status = body.status;

    const updated = deliveryStore.update(params.id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 400 },
    );
  }
}
