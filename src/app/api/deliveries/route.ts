import { NextRequest, NextResponse } from "next/server";
import { deliveryStore } from "@/lib/stores/deliveryStore";
import { notificationService } from "@/lib/services/notificationService";
import { Delivery, DeliveryStatus } from "@/types/delivery";
import { generateId } from "@/lib/utils"; // Assuming utils exists from master

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create new delivery instance (System->>d: new(...))
    const newDelivery: Delivery = {
      id: generateId("del"),
      trackingCode: `TBT-RP-${Date.now().toString().slice(-6)}`,
      status: DeliveryStatus.PENDING,
      createdAt: new Date().toISOString(),
      sender: body.sender,
      recipient: body.recipient,
      contains: body.contains,
      pickupFrom: body.pickupFrom, // Handles UC5 instantly if provided during creation
      dropOffAt: body.dropOffAt,
    };

    deliveryStore.save(newDelivery);

    // Notify team (System->>NotifService: notifyDeliveryTeam)
    await notificationService.notifyDeliveryTeam(newDelivery.id);

    return NextResponse.json(
      { success: true, data: newDelivery },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: deliveryStore.deliveries });
}
