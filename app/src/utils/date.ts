import { DateTime } from "luxon";

export function getTimeRemaining(date: Date) {
  return DateTime.fromJSDate(date).toRelative();
}
