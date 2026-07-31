// ----- ./src/app/api/notifications/stream/[id]/route.ts -----
import { NextRequest, NextResponse } from "next/server";
import {
  addNotificationListener,
  removeNotificationListener,
} from "@/lib/notificationHub";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = params.id;
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      addNotificationListener(userId, controller);

      // Send connection established event
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ status: "connected", userId })}\n\n`,
        ),
      );

      const interval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ status: "ping" })}\n\n`),
          );
        } catch (e) {
          clearInterval(interval);
          removeNotificationListener(userId, controller);
        }
      }, 10000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        removeNotificationListener(userId, controller);
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
