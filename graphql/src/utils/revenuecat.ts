import { productEnum } from "../../drizzle/schema"

/**
 * Type for the RevenueCat https://api.revenuecat.com/v1/subscribers response
 */
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

export type NonSubscriptions = Record<typeof productEnum.enumValues[number], {
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

/**
 * Type for the RevenuCat webook
 */
export interface Webhook {
  api_version: string
  event: Event
}

export interface Event {
  aliases: string[]
  app_id: string
  app_user_id: string
  commission_percentage: number
  country_code: string
  currency: string
  entitlement_id: string
  entitlement_ids: string[]
  environment: string
  event_timestamp_ms: number
  expiration_at_ms: number
  id: string
  is_family_share: boolean
  offer_code: string
  original_app_user_id: string
  original_transaction_id: string
  period_type: string
  presented_offering_id: string
  price: number
  price_in_purchased_currency: number
  product_id: string
  purchased_at_ms: number
  store: string
  subscriber_attributes: SubscriberAttributes
  takehome_percentage: number
  tax_percentage: number
  transaction_id: string
  type: string
}

export interface SubscriberAttributes {
  "$Favorite Cat": FavoriteCat
}

export interface FavoriteCat {
  updated_at_ms: number
  value: string
}
