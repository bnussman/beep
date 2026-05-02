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

