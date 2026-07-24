import { defineEntity, p } from '@mikro-orm/core';
import { User } from './User';

export const CarSchema = defineEntity({
  name: 'car',
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    make: p.string(),
    model: p.string(),
    color: p.string(),
    photo: p.string(),
    year: p.integer(),
    default: p.boolean(),
    created: p.datetime(),
    updated: p.datetime(),
  },
});

export class Car extends CarSchema.class {}

CarSchema.setClass(Car);
