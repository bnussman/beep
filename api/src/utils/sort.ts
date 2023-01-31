import { Beep } from "../entities/Beep";

export function inOrder(a: Beep, b: Beep): number {
  return a.start.getMilliseconds() - b.start.getMilliseconds();
}