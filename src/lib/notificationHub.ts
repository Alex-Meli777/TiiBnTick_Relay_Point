type NotificationPayload = {
  type: string;
  announcementId?: string;
  deliveryId?: string;
  requestId?: string;
  targetUserId?: string;
  message?: string;
  data?: any;
};

const globalStore = globalThis as any;

if (!globalStore.notificationListeners) {
  globalStore.notificationListeners = new Map<string, Set<WritableStreamDefaultController<Uint8Array>>>();
}

const listeners: Map<string, Set<WritableStreamDefaultController<Uint8Array>>> = globalStore.notificationListeners;

const encoder = new TextEncoder();

function sendToController(
  controller: WritableStreamDefaultController<Uint8Array>,
  payload: NotificationPayload,
) {
  try {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
  } catch {
    // If enqueue fails, the connection is likely closed.
    // The caller must remove the listener separately.
  }
}

export function addNotificationListener(
  userId: string,
  controller: WritableStreamDefaultController<Uint8Array>,
) {
  const userListeners = listeners.get(userId) ?? new Set();
  userListeners.add(controller);
  listeners.set(userId, userListeners);
}

export function removeNotificationListener(
  userId: string,
  controller: WritableStreamDefaultController<Uint8Array>,
) {
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
