import { QueueEntry } from "../entities/QueueEntry";

export function inOrder(a: QueueEntry, b: QueueEntry): number {
  return a.start - b.start;
}