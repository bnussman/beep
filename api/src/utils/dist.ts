import { Beep, Status } from "../entities/Beep";

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d * 0.621371;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getPositionInQueue(queue: Beep[], entry: Beep) {
  return queue.filter((q) => q.start < entry.start && q.status !== Status.WAITING).length;
}

export function getQueueSize(queue: Beep[]) {
  return queue.filter(entry => entry.status !== Status.WAITING).length
}