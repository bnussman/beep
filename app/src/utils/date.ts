import { DateTime } from "luxon";

export function getTimeRemaining(date: string) {
  return DateTime.fromISO(date).toRelative();
}
