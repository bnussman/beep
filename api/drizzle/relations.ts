import { defineRelations } from "drizzle-orm";
import {
  beep,
  cars,
  feedback,
  forgot_password,
  payments,
  ratings,
  reports,
  tokens,
  users,
  verify_email,
} from "./schema";

export const relations = defineRelations(
  {
    users,
    tokens,
    payments,
    forgot_password,
    feedback,
    cars,
    beep,
    reports,
    verify_email,
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
      forgot_passwords: r.many.forgot_password({
        from: r.users.id,
        to: r.forgot_password.user_id,
      }),
      verify_emails: r.many.verify_email({
        from: r.users.id,
        to: r.verify_email.user_id,
      }),
      feedbacks: r.many.feedback({ from: r.users.id, to: r.feedback.user_id }),
      cars: r.many.cars({ from: r.users.id, to: r.cars.user_id }),
      beeps: r.many.beep({
        from: r.users.id,
        to: r.beep.beeper_id,
        alias: "beeper",
      }),
      rides: r.many.beep({
        from: r.users.id,
        to: r.beep.rider_id,
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
    forgot_password: {
      user: r.one.users({
        from: r.forgot_password.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    verify_email: {
      user: r.one.users({
        from: r.verify_email.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    feedback: {
      user: r.one.users({
        from: r.feedback.user_id,
        to: r.users.id,
        optional: false,
      }),
    },
    cars: {
      user: r.one.users({ from: r.cars.user_id, to: r.users.id, optional: false }),
    },
    beep: {
      beeper: r.one.users({
        from: r.beep.beeper_id,
        to: r.users.id,
        alias: "beeper",
        optional: false,
      }),
      rider: r.one.users({
        from: r.beep.rider_id,
        to: r.users.id,
        alias: "rider",
        optional: false,
      }),
      ratings: r.many.ratings({ from: r.beep.id, to: r.ratings.beep_id }),
      reports: r.many.reports({ from: r.beep.id, to: r.reports.beep_id }),
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
      beep: r.one.beep({ from: r.reports.beep_id, to: r.beep.id }),
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
      beep: r.one.beep({ from: r.ratings.beep_id, to: r.beep.id }),
    },
  }),
);
