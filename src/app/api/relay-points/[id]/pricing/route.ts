// app/api/relay-points/[id]/pricing/route.ts
// This file acts as the Inbound Adapter for the Pricing Use Case.
import { NextRequest, NextResponse } from "next/server";
import { getMutableStore } from "@/mocks/relayPointsSeed";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const store = getMutableStore();
  const policy = store.relayPointPricingPolicies.find(
    (p) => p.relayPointId === params.id,
  );

  if (!policy) {
    return NextResponse.json(
      { success: false, error: "Policy not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: policy });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const store = getMutableStore();
  const index = store.relayPointPricingPolicies.findIndex(
    (p) => p.relayPointId === params.id,
  );

  if (index === -1) {
    // If not found, create one
    const newPolicy = {
      ...body,
      relayPointId: params.id,
      updatedAt: new Date().toISOString(),
    };
    store.relayPointPricingPolicies.push(newPolicy);
    return NextResponse.json({ success: true, data: newPolicy });
  }

  // Update existing
  store.relayPointPricingPolicies[index] = {
    ...store.relayPointPricingPolicies[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: store.relayPointPricingPolicies[index],
  });
}
