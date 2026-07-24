import { type Ref, defineEntity, p } from '@mikro-orm/core';
import { User } from './User';

export class ForgotPassword {
  id!: string;
  user!: Ref<User>;
  time!: Date;
}

export const ForgotPasswordSchema = defineEntity({
  class: ForgotPassword,
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    time: p.datetime(),
  },
});
