import { defineEntity, p } from '@mikro-orm/core';
import { User } from './User';

export const FeedbackSchema = defineEntity({
  name: 'feedback',
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    message: p.string(),
    created: p.datetime(),
  },
});

export class Feedback extends FeedbackSchema.class {}

FeedbackSchema.setClass(Feedback);
