import { and, eq, gte } from "drizzle-orm";
import { REVENUE_CAT_SECRET } from "./constants";
import { db } from "./db";
import { user, productEnum, payment, storeEnum } from "../../drizzle/schema";

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

type Product = typeof productEnum.enumValues[number];
type Store = typeof storeEnum.enumValues[number];

export const productPrice: Record<Product, number> = {
  'top_of_beeper_list_1_hour': 0.99,
  'top_of_beeper_list_2_hours': 1.99,
  'top_of_beeper_list_3_hours': 2.99,
}

export const productExpireTimes: Record<Product, number> = {
  'top_of_beeper_list_1_hour': (1 * 60 * 60 * 1000),
  top_of_beeper_list_2_hours: (2 * 60 * 60 * 1000),
  'top_of_beeper_list_3_hours': (3 * 60 * 60 * 1000),
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

export async function syncUserPayments(userId: string) {
  if (!userId) {
    throw new Error("No user id provided when syncing payments.");
  }

  if (!REVENUE_CAT_SECRET) {
    throw new Error("No REVENU_CAT_SECRET in env.");
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${REVENUE_CAT_SECRET}`
    }
  };

  const request = await fetch(`https://api.revenuecat.com/v1/subscribers/${userId}`, options);

  const response: SubscriberResponse = await request.json();

  const products = Object.keys(response.subscriber.non_subscriptions) as Product[];

  for (const product of products) {
    for (const paymentItem of response.subscriber.non_subscriptions[product]) {

      const created = new Date(paymentItem.purchase_date);

      try {
        await db.insert(payment).values({
          id: paymentItem.id,
          user_id: userId,
          store: paymentItem.store as Store,
          storeId: paymentItem.store_transaction_id,
          price: String(productPrice[product]),
          productId: product,
          created,
          expires: new Date(created.getTime() + productExpireTimes[product])
        })
      } catch (error) {
        console.error("payment might already be stored", error)
      }
    }
  }

  const activePayments = await db.query.payment.findMany({
    where: and(
      eq(payment.user_id, userId),
      gte(payment.expires, new Date())
    ),
  });

  return activePayments;
}
