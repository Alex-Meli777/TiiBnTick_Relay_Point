// ----- ./src/app/api/announcements/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import { deliveryStore } from "@/lib/stores/deliveryStore";

export async function GET() {
  const dtos = deliveryStore.deliveries.map((d: any) => {
    const parcelAny = d.contains as any;
    return {
      id: d.id,
      title: parcelAny?.designation || parcelAny?.description || "Colis",
      description: parcelAny?.description || "",
      status: d.status,
      amount: d.contains?.weight
        ? parseFloat(d.contains.weight as any) * 300 + 1500
        : 1500,
      pickupAddress: d.sender?.locatedAt,
      deliveryAddress: d.recipient?.locatedAt,
      recipientFirstName: d.recipient?.name || "",
      recipientPhone: d.recipient?.phone || "",
    };
  });
  return NextResponse.json({ success: true, data: dtos });
}
