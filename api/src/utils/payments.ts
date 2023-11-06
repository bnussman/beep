import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { Request, Response } from "express";
import { PAYMENT_SECRET } from "./constants";
import { User } from "../entities/User";
import { pubSub } from "../index";

export async function paymentHandler(req: Request, res: Response, orm: MikroORM<IDatabaseDriver<Connection>>) {
  const em = orm.em.fork();

  if (req.headers.authorization !== PAYMENT_SECRET) {
    console.error("Invalid payment credentials", req.headers);
    return res.status(403).json("Invalid credentials");
  }

  const payload = req.body as Webhook;

  console.log(payload);

  const user = await em.findOneOrFail(User, payload.event.app_user_id);

  if (payload.event.type === "INITIAL_PURCHASE") {
    user.isPremium = true;
  }

  if (payload.event.type === "EXPIRATION") {
    user.isPremium = false;
  }

  pubSub.publish("User" + user.id, user);

  await em.persistAndFlush(user);

  return res.status(200).json("Success");
}

export interface Webhook {
  event: Event
  api_version: string
}

export interface Event {
  event_timestamp_ms: number
  product_id: string
  period_type: string
  purchased_at_ms: number
  expiration_at_ms: number
  environment: string
  entitlement_id: any
  entitlement_ids: string[]
  presented_offering_id: any
  transaction_id: string
  original_transaction_id: string
  is_family_share: boolean
  country_code: string
  app_user_id: string
  aliases: string[]
  original_app_user_id: string
  currency: string
  price: number
  price_in_purchased_currency: number
  subscriber_attributes: SubscriberAttributes
  store: string
  takehome_percentage: number
  offer_code: any
  type: string
  id: string
  app_id: string
}

export interface SubscriberAttributes {
  $email: Email
}

export interface Email {
  updated_at_ms: number
  value: string
}

