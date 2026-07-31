type NotificationPayload = {
  type: string;
  announcementId?: string;
  deliveryId?: string;
  requestId?: string;
  targetUserId?: string;
  message?: string;
  data?: any;
};

type StreamController = any;

const globalStore = globalThis as any;

if (!globalStore.notificationListeners) {
  globalStore.notificationListeners = new Map<string, Set<StreamController>>();
}

const listeners: Map<string, Set<StreamController>> = globalStore.notificationListeners;

const encoder = new TextEncoder();

function sendToController(controller: StreamController, payload: NotificationPayload) {
  try {
    // Try enqueueing a plain string (SSE) and fall back to Uint8Array.
    try {
      controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
    } catch {
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      } catch {
        // ignore enqueue failures
      }
    }
  } catch {
    // ignore
  }
}

export function addNotificationListener(userId: string, controller: StreamController) {
  const userListeners = listeners.get(userId) ?? new Set();
  userListeners.add(controller);
  listeners.set(userId, userListeners);
}

export function removeNotificationListener(userId: string, controller: StreamController) {
  const userListeners = listeners.get(userId);
  if (!userListeners) return;
  userListeners.delete(controller);
  if (userListeners.size === 0) {
    listeners.delete(userId);
  }
}

export function notifyUser(userId: string, payload: NotificationPayload) {
  const userListeners = listeners.get(userId);
  if (!userListeners) return;
  for (const controller of Array.from(userListeners)) {
    sendToController(controller, payload);
  }
}

export function notifyAll(payload: NotificationPayload) {
  for (const [userId, userListeners] of listeners.entries()) {
    for (const controller of Array.from(userListeners)) {
      sendToController(controller, payload);
    }
  }
}
