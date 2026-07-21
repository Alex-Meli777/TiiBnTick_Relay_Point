import { NextRequest, NextResponse } from "next/server";
import { deliverRequestStore } from "@/lib/stores/deliverRequestStore";
import { deliveryStore } from "@/lib/stores/deliveryStore";
import { notificationService } from "@/lib/services/notificationService";
import { DeliveryStatus } from "@/types/delivery"; // Enums
import { RequestStatus } from "@/types/deliverRequest"; // Enums

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const req = deliverRequestStore.findById(params.id);
    if (!req)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // 1. Accept the request
    req.status = RequestStatus.ACCEPTED;

    // 2. Update the Delivery Status to ASSIGNED
    const updatedDelivery = deliveryStore.update(req.deliveryId, {
      status: DeliveryStatus.ASSIGNED,
      assignedTo: req.deliverId,
    });

    // 3. Notify the deliver and include the request + updated delivery so clients can react immediately
    await notificationService.notifyDeliver(
      req.id,
      req.deliverId,
      req.deliveryId,
      req,
      updatedDelivery,
    );

    return NextResponse.json({ success: true, data: req });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }
}
