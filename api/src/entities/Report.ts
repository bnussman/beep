import { defineEntity, p } from '@mikro-orm/core';
import { Beep } from './Beep';
import { Rating } from './Rating';
import { User } from './User';

export const ReportSchema = defineEntity({
  name: 'report',
  properties: {
    id: p.string().primary(),
    reporter: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    reported: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    handledBy: () => p.manyToOne(User).ref().updateRule('cascade').nullable(),
    reason: p.string(),
    notes: p.string().nullable(),
    timestamp: p.datetime(),
    handled: p.boolean(),
    beep: () => p.manyToOne(Beep).ref().updateRule('cascade').nullable(),
    rating: () => p.manyToOne(Rating).ref().updateRule('cascade').nullable(),
  },
});

export class Report extends ReportSchema.class {}

ReportSchema.setClass(Report)
