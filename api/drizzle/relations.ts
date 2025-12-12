import { defineRelations } from "drizzle-orm";
import {
  beep,
  car,
  feedback,
  forgot_password,
  payment,
  rating,
  report,
  token,
  user,
  verify_email,
} from "./schema";

export const relations = defineRelations(
  {
    user,
    token,
    payment,
    forgot_password,
    feedback,
    car,
    beep,
    report,
    verify_email,
    rating,
  },
  (r) => ({
    token: {
      user: r.one.user({
        from: r.token.user_id,
        to: r.user.id,
        optional: false,
      }),
    },
    user: {
      tokens: r.many.token({ from: r.user.id, to: r.token.user_id }),
      payments: r.many.payment({ from: r.user.id, to: r.payment.user_id }),
      forgot_passwords: r.many.forgot_password({
        from: r.user.id,
        to: r.forgot_password.user_id,
      }),
      verify_emails: r.many.verify_email({
        from: r.user.id,
        to: r.verify_email.user_id,
      }),
      feedbacks: r.many.feedback({ from: r.user.id, to: r.feedback.user_id }),
      cars: r.many.car({ from: r.user.id, to: r.car.user_id }),
      beeps: r.many.beep({
        from: r.user.id,
        to: r.beep.beeper_id,
        alias: "beeper",
      }),
      rides: r.many.beep({
        from: r.user.id,
        to: r.beep.rider_id,
        alias: "rider",
      }),
      reports: r.many.report({
        from: r.user.id,
        to: r.report.reporter_id,
        alias: "reporter",
      }),
      complaints: r.many.report({
        from: r.user.id,
        to: r.report.reported_id,
        alias: "reported",
      }),
      ratings: r.many.rating({
        from: r.user.id,
        to: r.rating.rater_id,
        alias: "rater",
      }),
      reviews: r.many.rating({
        from: r.user.id,
        to: r.rating.rated_id,
        alias: "rated",
      }),
      handledRatings: r.many.rating({
        from: r.user.id,
        to: r.rating.rated_id,
        alias: "handler",
      }),
    },
    payment: {
      user: r.one.user({
        from: r.payment.user_id,
        to: r.user.id,
        optional: false,
      }),
    },
    forgot_password: {
      user: r.one.user({
        from: r.forgot_password.user_id,
        to: r.user.id,
        optional: false,
      }),
    },
    verify_email: {
      user: r.one.user({
        from: r.verify_email.user_id,
        to: r.user.id,
        optional: false,
      }),
    },
    feedback: {
      user: r.one.user({
        from: r.feedback.user_id,
        to: r.user.id,
        optional: false,
      }),
    },
    car: {
      user: r.one.user({ from: r.car.user_id, to: r.user.id, optional: false }),
    },
    beep: {
      beeper: r.one.user({
        from: r.beep.beeper_id,
        to: r.user.id,
        alias: "beeper",
        optional: false,
      }),
      rider: r.one.user({
        from: r.beep.rider_id,
        to: r.user.id,
        alias: "rider",
        optional: false,
      }),
      ratings: r.many.rating({ from: r.beep.id, to: r.rating.beep_id }),
      reports: r.many.report({ from: r.beep.id, to: r.report.beep_id }),
    },
    report: {
      reporter: r.one.user({
        from: r.report.reporter_id,
        to: r.user.id,
        alias: "reporter",
        optional: false,
      }),
      reported: r.one.user({
        from: r.report.reported_id,
        to: r.user.id,
        alias: "reported",
        optional: false,
      }),
      handledBy: r.one.user({
        from: r.report.handled_by_id,
        to: r.user.id,
        alias: "handler",
      }),
      beep: r.one.beep({ from: r.report.beep_id, to: r.beep.id }),
    },
    rating: {
      rater: r.one.user({
        from: r.rating.rater_id,
        to: r.user.id,
        alias: "rater",
        optional: false,
      }),
      rated: r.one.user({
        from: r.rating.rated_id,
        to: r.user.id,
        alias: "rated",
        optional: false,
      }),
      beep: r.one.beep({ from: r.rating.beep_id, to: r.beep.id }),
    },
  }),
);
