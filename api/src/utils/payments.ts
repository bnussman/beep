import { and, eq, gte } from "drizzle-orm";
import { REVENUE_CAT_SECRET, REVENUE_CAT_WEBHOOK_TOKEN } from "./constants";
import { db } from "./db";
import { user, productEnum, payment, storeEnum } from "../../drizzle/schema";
import * as Sentry from '@sentry/bun';
import type { ServerResponse } from 'node:http';
import { SubscriberResponse, Webhook } from "./revenuecat";

type Product = typeof productEnum.enumValues[number];
type Store = typeof storeEnum.enumValues[number];

export const productPrice: Record<Product, number> = {
  top_of_beeper_list_1_hour: 0.99,
  top_of_beeper_list_2_hours: 1.99,
  top_of_beeper_list_3_hours: 2.99,
}

export const productExpireTimes: Record<Product, number> = {
  top_of_beeper_list_1_hour: (1 * 60 * 60 * 1000),
  top_of_beeper_list_2_hours: (2 * 60 * 60 * 1000),
  top_of_beeper_list_3_hours: (3 * 60 * 60 * 1000),
}

/**
 * Makes a fetch to https://api.revenuecat.com/v1/subscribers/:id
 * to sync our database with RevenuCat's purchases
 */
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

/**
 * A webhook RevenueCat uses to let us know a payment was made.
 */
export async function handlePaymentWebook(request: Request, res: ServerResponse) {
  const data: Webhook = await request.json();

  if (request.headers.get("Authorization") !== `Bearer ${REVENUE_CAT_WEBHOOK_TOKEN}`) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Unable to auth webhook call!\n');
  }

  try {
    await syncUserPayments(data.event.app_user_id);
  } catch (error) {
    Sentry.captureException(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error!\n');
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Success!\n');
}
