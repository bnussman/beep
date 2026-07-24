import { defineEntity, p } from '@mikro-orm/core';
import { Beep } from './Beep';
import { Car } from './Car';
import { Feedback } from './Feedback';
import { ForgotPassword } from './ForgotPassword';
import { Payment } from './Payment';
import { Rating } from './Rating';
import { Report } from './Report';
import { Token } from './Token';
import { VerifyEmail } from './VerifyEmail';

export const UserPasswordType = {
  SHA256: 'sha256',
  BCRYPT: 'bcrypt',
} as const;

export type TUserPasswordType = (typeof UserPasswordType)[keyof typeof UserPasswordType];

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserSchema = defineEntity({
  name: 'user',
  indexes: [
    {
      name: 'user_is_beeping_idx',
      where: 'is_beeping = true',
      properties: ['isBeeping'],
    },
  ],
  properties: {
    id: p.string().primary(),
    first: p.string(),
    last: p.string(),
    username: p.string().unique('user_username_unique'),
    email: p.string().unique('user_email_unique'),
    phone: p.string(),
    venmo: p.string().nullable(),
    cashapp: p.string().nullable(),
    password: p.string(),
    passwordType: p.enum(() => UserPasswordType).nativeEnumName('user_password_type'),
    isBeeping: p.boolean().index('user_is_beeping_idx'),
    isEmailVerified: p.boolean(),
    isStudent: p.boolean(),
    groupRate: p.integer(),
    singlesRate: p.integer(),
    capacity: p.integer(),
    queueSize: p.integer(),
    rating: p.decimal().nullable(),
    role: p.enum(() => UserRole).nativeEnumName('user_role'),
    pushToken: p.string().nullable(),
    photo: p.string().nullable(),
    location: p.unknown().columnType('geometry').nullable(),
    created: p.datetime().nullable(),
    beepCollection: () => p.oneToMany(Beep).mappedBy('beeper'),
    beepCollection1: () => p.oneToMany(Beep).mappedBy('rider'),
    carCollection: () => p.oneToMany(Car).mappedBy('user'),
    feedbackCollection: () => p.oneToMany(Feedback).mappedBy('user'),
    forgotPasswordCollection: () => p.oneToMany(ForgotPassword).mappedBy('user'),
    paymentCollection: () => p.oneToMany(Payment).mappedBy('user'),
    ratingCollection: () => p.oneToMany(Rating).mappedBy('rater'),
    ratingCollection1: () => p.oneToMany(Rating).mappedBy('rated'),
    reportCollection: () => p.oneToMany(Report).mappedBy('reporter'),
    reportCollection1: () => p.oneToMany(Report).mappedBy('reported'),
    reportCollection2: () => p.oneToMany(Report).mappedBy('handledBy'),
    tokenCollection: () => p.oneToMany(Token).mappedBy('user'),
    verifyEmailCollection: () => p.oneToMany(VerifyEmail).mappedBy('user'),
  },
});

export class User extends UserSchema.class {}

UserSchema.setClass(User);
