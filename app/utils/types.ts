export interface Subscription {
  closed: boolean;
  unsubscribe(): void;
}