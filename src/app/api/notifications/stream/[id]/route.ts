// ----- ./src/app/api/notifications/stream/[id]/route.ts -----
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send connection established event
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ status: "connected", client: params.id })}\n\n`,
        ),
      );

      // Stream periodic connection pings
      const interval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ status: "ping" })}\n\n`),
          );
        } catch (e) {
          clearInterval(interval);
        }
      }, 10000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new NextResponse(customStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

import { NextResponse } from "next/server";
