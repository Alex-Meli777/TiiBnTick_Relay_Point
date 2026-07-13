// ----- ./src/app/api/deliveries/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import { deliveryStore } from "@/lib/stores/deliveryStore";
import { notificationService } from "@/lib/services/notificationService";
import { Delivery, DeliveryStatus } from "@/types/delivery";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const weightVal =
      body.contains?.weight || body.packet?.weight || body.weight || 1;
    const parsedWeight = parseFloat(weightVal);

    // Map mixed inputs cleanly to meet the strict Delivery interface definitions
    const newDelivery: Delivery = {
      id: generateId("del"),
      trackingCode: `TBT-RP-${Date.now().toString().slice(-6)}`,
      status: DeliveryStatus.PENDING,
      createdAt: new Date().toISOString(),
      sender: {
        name:
          body.sender?.name ||
          `${body.senderLastName || ""} ${body.senderFirstName || ""}`.trim() ||
          body.shipperFirstName ||
          "Expéditeur",
        phone:
          body.sender?.phone ||
          body.senderPhone ||
          body.shipperPhone ||
          "699000000",
        locatedAt: body.sender?.locatedAt ||
          body.pickupAddress || {
            street: body.senderAddress || "",
            city: body.senderCity || "Yaoundé",
            zipCode: "",
            country: body.senderCountry || "Cameroun",
          },
      },
      recipient: {
        name:
          body.recipient?.name ||
          `${body.recipientLastName || ""} ${body.recipientFirstName || ""}`.trim() ||
          body.recipientFirstName ||
          "Destinataire",
        phone: body.recipient?.phone || body.recipientPhone || "699000000",
        locatedAt: body.recipient?.locatedAt ||
          body.deliveryAddress || {
            street: body.recipientAddress || "",
            city: body.recipientCity || "Yaoundé",
            zipCode: "",
            country: body.recipientCountry || "Cameroun",
          },
      },
      contains: {
        weight: isNaN(parsedWeight) ? 1 : parsedWeight,
        dimensions:
          body.contains?.dimensions ||
          `${body.length || 10}x${body.width || 10}x${body.height || 10}`,
        description:
          body.contains?.description ||
          body.description ||
          body.designation ||
          "Colis",
      },
    };

    deliveryStore.save(newDelivery);

    // Call Application Notification service
    await notificationService.notifyDeliveryTeam(newDelivery.id);

    return NextResponse.json(
      { success: true, data: newDelivery },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Données d'expédition invalides." },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: deliveryStore.deliveries });
}
