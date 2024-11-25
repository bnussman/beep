import { and, desc, eq, gte } from "drizzle-orm";
import { REVENUE_CAT_SECRET, REVENUE_CAT_WEBHOOK_TOKEN } from "./constants";
import { db } from "./db";
import { user, productEnum, payment, storeEnum } from "../../drizzle/schema";
import * as Sentry from '@sentry/bun';
import { SubscriberResponse, Webhook } from "./revenuecat";
import { paths } from "./revenucat-api";

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

export async function syncUserPaymentsV2(userId: string) {
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

  const usersMostRecentPayment = await db.query.payment.findFirst({
    where: eq(user.id, userId),
    orderBy: desc(payment.created)
  });

  const queryParams = new URLSearchParams({
    environment: 'production',
  });

  if (usersMostRecentPayment) {
    queryParams.set('starting_after', usersMostRecentPayment.id);
  }

  do {
    const url = `https://api.revenuecat.com/v2/projects/d7da55a3/customers/${userId}/purchases?${queryParams.toString()}`
    const request = await fetch(url, options);

    if (request.status >= 400) {
      throw new Error(`Got a ${request.status} response from RevenueCat's API`);
    }

    const response: paths['/projects/{project_id}/customers/{customer_id}/purchases']['get']['responses']['200']['content']['application/json'] = await request.json();

    for (const paymentItem of response.items) {
      const created = new Date(paymentItem.purchased_at);
      const productId = paymentItem.product_id as Product;

      try {
        await db.insert(payment).values({
          id: paymentItem.id,
          user_id: userId,
          store: paymentItem.store as Store,
          storeId: paymentItem.store_purchase_identifier,
          price: String(productPrice[productId]),
          productId,
          created,
          expires: new Date(created.getTime() + productExpireTimes[productId])
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    }

    if (response.next_page) {
      const nextPageParam = new URLSearchParams(response.next_page).get('starting_after');

      if (nextPageParam) {
        queryParams.set('starting_after', nextPageParam);
      } else {
        queryParams.delete('starting_after');
      }
    } else {
      queryParams.delete('starting_after');
    }

  } while (queryParams.has('starting_after'))

  const activePayments = await db.query.payment.findMany({
    where: and(
      eq(payment.user_id, userId),
      gte(payment.expires, new Date())
    ),
  });

  return activePayments;
}

export async function syncUserPaymentsV1(userId: string) {
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
export async function handlePaymentWebook(request: Request) {
  const data: Webhook = await request.json();

  if (request.headers.get("Authorization") !== `Bearer ${REVENUE_CAT_WEBHOOK_TOKEN}`) {
    return new Response("Unable to auth webhook call", { status: 401 });
  }

  try {
    await syncUserPaymentsV1(data.event.app_user_id);
  } catch (error) {
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response("Success");
}
