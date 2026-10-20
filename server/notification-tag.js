// Presentation only: never deduplicate delivery, history, or saved lock changes.
const ROUTINE = new Set(['green','blue','yellow','purple','white','black']);
function lockIdentity(message) {
  const unit = typeof message.unit === 'string' ? message.unit.replace(/[-\s]/g,'').toUpperCase() : '';
  if (!/^[A-Z0-9]{1,12}$/.test(unit) || typeof message.eventId !== 'string' || !/^[A-Za-z0-9_-]{1,150}$/.test(message.eventId)) return null;
  if (!ROUTINE.has(message.type) && !['red','flashred','flashgreen'].includes(message.type)) return null;
  return {unit,eventId:message.eventId};
}
export function notificationTag(message, deliveryId) {
  const identity=lockIdentity(message);
  // Every saved event has a stable retry identity, independent of delivery time.
  return identity ? `storewell:event:${identity.unit}:${message.type}:${identity.eventId}` : deliveryId;
}
export function notificationActivity(message,committedAt) {
  const identity=lockIdentity(message);
  if (!identity || !ROUTINE.has(message.type) || !Number.isSafeInteger(committedAt) || committedAt<0) return undefined;
  // Only the resolved Firebase commit marker can order grouped notifications.
  // Client entry.t, push-key timestamps and HTTP arrival time are not authoritative.
  return {key:`storewell:lock:${identity.unit}:${message.type}`,eventId:identity.eventId,eventAt:committedAt};
}
