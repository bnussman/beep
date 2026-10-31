import { DateTime } from "luxon";

const UNIT_LABELS = {
  days: "day",
  hours: "hr",
  minutes: "min",
  seconds: "sec",
} as const;

export function getTimeRemaining(date: Date) {
  const diff = DateTime.fromJSDate(date).diffNow([
    "days",
    "hours",
    "minutes",
    "seconds",
  ]);

  if (!diff.isValid) {
    return null;
  }

  const isPast = diff.valueOf() < 0;
  const units = (isPast ? diff.negate() : diff)
    .mapUnits((value) => Math.floor(value))
    .toObject();

  // Luxon's toHuman() needs Intl.ListFormat, which Hermes doesn't support
  const human = Object.entries(units)
    .filter(([, value]) => value > 0)
    .slice(0, 2)
    .map(([unit, value]) => `${value} ${UNIT_LABELS[unit as keyof typeof UNIT_LABELS]}`)
    .join(" ");

  if (!human) {
    return "now";
  }

  return isPast ? `${human} ago` : `in ${human}`;
}
