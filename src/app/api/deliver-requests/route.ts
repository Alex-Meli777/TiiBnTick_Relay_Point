import { NextRequest, NextResponse } from "next/server";
import { deliverRequestStore } from "@/lib/stores/deliverRequestStore";
import { deliveryStore } from "@/lib/stores/deliveryStore";
import { notificationService } from "@/lib/services/notificationService";
import { DeliverRequest, RequestStatus } from "@/types/deliverRequest";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deliveryId = searchParams.get("deliveryId");
    const deliverId = searchParams.get("deliverId");

    let results = deliverRequestStore.requests;
    if (deliveryId) {
      results = results.filter((r) => r.deliveryId === deliveryId);
    }
    if (deliverId) {
      results = results.filter((r) => r.deliverId === deliverId);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to fetch deliver requests" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newRequest: DeliverRequest = {
      id: generateId("req"),
      deliveryId: body.deliveryId,
      deliverId: body.deliverId,
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    deliverRequestStore.save(newRequest);

    const delivery = deliveryStore.findById(newRequest.deliveryId);
    const clientId = delivery?.clientId;

    // Notify client with the full request payload so other server instances can react immediately
    await notificationService.notifyClient(
      newRequest.id,
      clientId,
      newRequest.deliveryId,
      newRequest.deliverId,
      newRequest,
    );

    return NextResponse.json(
      { success: true, data: newRequest },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }
}
