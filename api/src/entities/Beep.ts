import { defineEntity, p } from '@mikro-orm/core';
import { Rating } from './Rating';
import { Report } from './Report';
import { User } from './User';

export const BeepStatus = {
  CANCELED: 'canceled',
  DENIED: 'denied',
  WAITING: 'waiting',
  ACCEPTED: 'accepted',
  ON_THE_WAY: 'on_the_way',
  HERE: 'here',
  IN_PROGRESS: 'in_progress',
  COMPLETE: 'complete',
} as const;

export type TBeepStatus = (typeof BeepStatus)[keyof typeof BeepStatus];

export const BeepSchema = defineEntity({
  name: 'beep',
  indexes: [{ name: 'beeper_id_rider_id_idx', properties: ['beeper', 'rider'] }],
  properties: {
    id: p.string().primary(),
    beeper: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade').index('beeper_id_idx'),
    rider: () => p.manyToOne(User).ref().updateRule('cascade').deleteRule('cascade').index('rider_id_idx'),
    origin: p.string(),
    destination: p.string(),
    groupSize: p.integer(),
    start: p.datetime().index('start_idx'),
    end: p.datetime().nullable(),
    status: p.enum(() => BeepStatus).nativeEnumName('beep_status').index('status_idx'),
    riderLiveActivityToken: p.string().nullable(),
    riderLiveActivityId: p.string().nullable(),
    pickUpEta: p.datetime().nullable(),
    pickUpEtaUpdatedAt: p.datetime().nullable(),
    ratingCollection: () => p.oneToMany(Rating).mappedBy('beep'),
    reportCollection: () => p.oneToMany(Report).mappedBy('beep'),
  },
});


export class Beep extends BeepSchema.class {}

BeepSchema.setClass(Beep);
