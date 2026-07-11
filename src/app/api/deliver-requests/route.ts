import { NextRequest, NextResponse } from "next/server";
import { deliverRequestStore } from "@/lib/stores/deliverRequestStore";
import { notificationService } from "@/lib/services/notificationService";
import { DeliverRequest, RequestStatus } from "@/types/deliverRequest";
import { generateId } from "@/lib/utils";

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

    // Notify client (System->>NotifService: notifyClient)
    await notificationService.notifyClient(newRequest.id);

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
