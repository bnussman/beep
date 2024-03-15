import { REVENUE_CAT_WEBHOOK_TOKEN } from "./constants";
import { syncUserPayments } from "../payments/resolver";
import * as Sentry from '@sentry/node';
import type { MikroORM } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import type { Webhook } from "../payments/utils";

export async function handlePaymentWebook(request: Request, orm: MikroORM<PostgreSqlDriver>) {
  const data: Webhook = await request.json();

  if (request.headers.get("Authorization") !== `Bearer ${REVENUE_CAT_WEBHOOK_TOKEN}`) {
    return new Response("Unable to auth webhook call", { status: 403 });
  }

  try {
    await syncUserPayments(orm.em.fork(), data.event.app_user_id);
  } catch (error) {
    Sentry.captureException(error);
    return new Response("Error syncing payments for user", { status: 500 });
  }

  return new Response("Success!");
}
