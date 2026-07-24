import { defineEntity, p } from '@mikro-orm/core';
import { User } from './User';

export const PaymentStore = {
  PLAY_STORE: 'play_store',
  APP_STORE: 'app_store',
} as const;

export const PaymentProduct = {
  TOP_OF_BEEPER_LIST_1_HOUR: 'top_of_beeper_list_1_hour',
  TOP_OF_BEEPER_LIST_2_HOURS: 'top_of_beeper_list_2_hours',
  TOP_OF_BEEPER_LIST_3_HOURS: 'top_of_beeper_list_3_hours',
} as const;

export type TPaymentStore = (typeof PaymentStore)[keyof typeof PaymentStore];
export type TPaymentProduct = (typeof PaymentProduct)[keyof typeof PaymentProduct];

export const PaymentSchema = defineEntity({
  name: 'payment',
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    storeId: p.string(),
    productId: p.enum(() => PaymentProduct).nativeEnumName('payment_product'),
    price: p.decimal(),
    store: p.enum(() => PaymentStore).nativeEnumName('payment_store'),
    created: p.datetime(),
    expires: p.datetime(),
  },
});

export class Payment extends PaymentSchema.class {}

PaymentSchema.setClass(Payment)
