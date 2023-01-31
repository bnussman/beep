export interface Subscription {
  closed: boolean;
  unsubscribe(): void;
}

export enum Status {
  DENIED = "denied",
  WAITING = "waiting",
  ACCEPTED = "accepted",
  ON_THE_WAY = "on_the_way",
  HERE = "here",
  IN_PROGRESS = "in_progress",
  COMPLETE = "complete",
}
