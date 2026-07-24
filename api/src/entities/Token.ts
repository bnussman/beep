import { defineEntity, p } from '@mikro-orm/core';
import { User } from './User';

export const TokenSchema = defineEntity({
  name: 'token',
  properties: {
    id: p.string().primary(),
    tokenid: p.string(),
    user: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
  },
});

export class Token extends TokenSchema.class {}

TokenSchema.setClass(Token)
