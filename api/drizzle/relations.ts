import { defineRelations } from "drizzle-orm";
import {
  beeps,
  cars,
  feedbacks,
  forgotPasswords,
  payments,
  ratings,
  reports,
  tokens,
  users,
  emailVerifications,
} from "./schema";

export const relations = defineRelations(
  {
    users,
    tokens,
    payments,
    forgotPasswords,
    feedbacks,
    cars,
    beeps,
    reports,
    emailVerifications,
    ratings,
  },
  (r) => ({
    tokens: {
      user: r.one.users({
        from: r.tokens.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    users: {
      tokens: r.many.tokens({ from: r.users.id, to: r.tokens.user_id }),
      payments: r.many.payments({ from: r.users.id, to: r.payments.user_id }),
      forgot_passwords: r.many.forgotPasswords({
        from: r.users.id,
        to: r.forgotPasswords.user_id,
      }),
      verify_emails: r.many.emailVerifications({
        from: r.users.id,
        to: r.emailVerifications.user_id,
      }),
      feedbacks: r.many.feedbacks({ from: r.users.id, to: r.feedbacks.user_id }),
      cars: r.many.cars({ from: r.users.id, to: r.cars.user_id }),
      beeps: r.many.beeps({
        from: r.users.id,
        to: r.beeps.beeper_id,
        alias: "beeper",
      }),
      rides: r.many.beeps({
        from: r.users.id,
        to: r.beeps.rider_id,
        alias: "rider",
      }),
      reports: r.many.reports({
        from: r.users.id,
        to: r.reports.reporter_id,
        alias: "reporter",
      }),
      complaints: r.many.reports({
        from: r.users.id,
        to: r.reports.reported_id,
        alias: "reported",
      }),
      ratings: r.many.ratings({
        from: r.users.id,
        to: r.ratings.rater_id,
        alias: "rater",
      }),
      reviews: r.many.ratings({
        from: r.users.id,
        to: r.ratings.rated_id,
        alias: "rated",
      }),
      handledRatings: r.many.ratings({
        from: r.users.id,
        to: r.ratings.rated_id,
        alias: "handler",
      }),
    },
    payments: {
      user: r.one.users({
        from: r.payments.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    forgotPasswords: {
      user: r.one.users({
        from: r.forgotPasswords.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    emailVerifications: {
      user: r.one.users({
        from: r.emailVerifications.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    feedbacks: {
      user: r.one.users({
        from: r.feedbacks.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    cars: {
      user: r.one.users({ from: r.cars.user_id, to: r.users.id, optional: false }),
    },
    beeps: {
      beeper: r.one.users({
        from: r.beeps.beeper_id,
        to: r.users.id,
        alias: "beeper",
        optional: false,
      }),
      rider: r.one.users({
        from: r.beeps.rider_id,
        to: r.users.id,
        alias: "rider",
        optional: false,
      }),
      ratings: r.many.ratings({ from: r.beeps.id, to: r.ratings.beep_id }),
      reports: r.many.reports({ from: r.beeps.id, to: r.reports.beep_id }),
    },
    reports: {
      reporter: r.one.users({
        from: r.reports.reporter_id,
        to: r.users.id,
        alias: "reporter",
        optional: false,
      }),
      reported: r.one.users({
        from: r.reports.reported_id,
        to: r.users.id,
        alias: "reported",
        optional: false,
      }),
      handledBy: r.one.users({
        from: r.reports.handled_by_id,
        to: r.users.id,
        alias: "handler",
      }),
      beep: r.one.beeps({ from: r.reports.beep_id, to: r.beeps.id }),
      rating: r.one.ratings({ from: r.reports.rating_id, to: r.ratings.id }),
    },
    ratings: {
      rater: r.one.users({
        from: r.ratings.rater_id,
        to: r.users.id,
        alias: "rater",
        optional: false,
      }),
      rated: r.one.users({
        from: r.ratings.rated_id,
        to: r.users.id,
        alias: "rated",
        optional: false,
      }),
      beep: r.one.beeps({ from: r.ratings.beep_id, to: r.beeps.id }),
    },
  }),
);
