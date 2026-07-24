import { defineEntity, p } from '@mikro-orm/core';
import { User } from './User';

export const VerifyEmailSchema = defineEntity({
  name: 'verify_email',
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    time: p.datetime(),
    email: p.string(),
  },
});

export class VerifyEmail extends VerifyEmailSchema.class {}

VerifyEmailSchema.setClass(VerifyEmail);
