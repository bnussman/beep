import { defineEntity, p } from '@mikro-orm/core';
import { Beep } from './Beep';
import { Report } from './Report';
import { User } from './User';

export const RatingSchema = defineEntity({
  name: 'rating',
  uniques: [
    { name: 'rating_beep_id_rater_id_unique', properties: ['rater', 'beep'] },
  ],
  properties: {
    id: p.string().primary(),
    rater: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    rated: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade'),
    stars: p.integer(),
    message: p.string().nullable(),
    timestamp: p.datetime(),
    beep: () => p.manyToOne(Beep).ref().updateRule('cascade').deleteRule('cascade'),
    reportCollection: () => p.oneToMany(Report).mappedBy('rating'),
  },
});

export class Rating extends RatingSchema.class {}

RatingSchema.setClass(Rating)
