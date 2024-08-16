import type { Product } from "../entities/Payment"

export interface SubscriberResponse {
  request_date: string
  request_date_ms: number
  subscriber: Subscriber
}

export interface Subscriber {
  entitlements: Entitlements
  first_seen: string
  management_url: string
  non_subscriptions: NonSubscriptions
  original_app_user_id: string
  original_application_version: string
  original_purchase_date: string
  other_purchases: OtherPurchases
  subscriptions: Subscriptions
}

export interface Entitlements {
  pro_cat: ProCat
}

export interface ProCat {
  expires_date: any
  grace_period_expires_date: any
  product_identifier: string
  purchase_date: string
}

export type NonSubscriptions = Record<Product, {
  id: string;
  purchase_date: string;
  store: string;
  store_transaction_id: string;
}[]>;

export interface Onetime {
  id: string
  is_sandbox: boolean
  purchase_date: string
  store: string
}

export interface OtherPurchases {}

export interface Subscriptions {
  premium_0: Annual
}

export interface Annual {
  auto_resume_date: any
  billing_issues_detected_at: any
  expires_date: string
  grace_period_expires_date: any
  is_sandbox: boolean
  original_purchase_date: string
  ownership_type: string
  period_type: string
  purchase_date: string
  refunded_at: any
  store: string
  unsubscribe_detected_at: string
}
