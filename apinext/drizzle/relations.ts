import { relations } from "drizzle-orm/relations";
import { user, token, payment, forgot_password, feedback, car, beep, report, rating, verify_email } from "./schema";

export const tokenRelations = relations(token, ({one}) => ({
	user: one(user, {
		fields: [token.user_id],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	tokens: many(token),
	payments: many(payment),
	forgot_passwords: many(forgot_password),
	feedbacks: many(feedback),
	cars: many(car),
	beeps_beeper_id: many(beep, {
		relationName: "beep_beeper_id_user_id"
	}),
	beeps_rider_id: many(beep, {
		relationName: "beep_rider_id_user_id"
	}),
	reports_reporter_id: many(report, {
		relationName: "report_reporter_id_user_id"
	}),
	reports_reported_id: many(report, {
		relationName: "report_reported_id_user_id"
	}),
	reports_handled_by_id: many(report, {
		relationName: "report_handled_by_id_user_id"
	}),
	ratings_rater_id: many(rating, {
		relationName: "rating_rater_id_user_id"
	}),
	ratings_rated_id: many(rating, {
		relationName: "rating_rated_id_user_id"
	}),
	verify_emails: many(verify_email),
}));

export const paymentRelations = relations(payment, ({one}) => ({
	user: one(user, {
		fields: [payment.user_id],
		references: [user.id]
	}),
}));

export const forgot_passwordRelations = relations(forgot_password, ({one}) => ({
	user: one(user, {
		fields: [forgot_password.user_id],
		references: [user.id]
	}),
}));

export const feedbackRelations = relations(feedback, ({one}) => ({
	user: one(user, {
		fields: [feedback.user_id],
		references: [user.id]
	}),
}));

export const carRelations = relations(car, ({one}) => ({
	user: one(user, {
		fields: [car.user_id],
		references: [user.id]
	}),
}));

export const beepRelations = relations(beep, ({one, many}) => ({
	user_beeper_id: one(user, {
		fields: [beep.beeper_id],
		references: [user.id],
		relationName: "beep_beeper_id_user_id"
	}),
	user_rider_id: one(user, {
		fields: [beep.rider_id],
		references: [user.id],
		relationName: "beep_rider_id_user_id"
	}),
	reports: many(report),
	ratings: many(rating),
}));

export const reportRelations = relations(report, ({one}) => ({
	user_reporter_id: one(user, {
		fields: [report.reporter_id],
		references: [user.id],
		relationName: "report_reporter_id_user_id"
	}),
	user_reported_id: one(user, {
		fields: [report.reported_id],
		references: [user.id],
		relationName: "report_reported_id_user_id"
	}),
	user_handled_by_id: one(user, {
		fields: [report.handled_by_id],
		references: [user.id],
		relationName: "report_handled_by_id_user_id"
	}),
	beep: one(beep, {
		fields: [report.beep_id],
		references: [beep.id]
	}),
}));

export const ratingRelations = relations(rating, ({one}) => ({
	user_rater_id: one(user, {
		fields: [rating.rater_id],
		references: [user.id],
		relationName: "rating_rater_id_user_id"
	}),
	user_rated_id: one(user, {
		fields: [rating.rated_id],
		references: [user.id],
		relationName: "rating_rated_id_user_id"
	}),
	beep: one(beep, {
		fields: [rating.beep_id],
		references: [beep.id]
	}),
}));

export const verify_emailRelations = relations(verify_email, ({one}) => ({
	user: one(user, {
		fields: [verify_email.user_id],
		references: [user.id]
	}),
}));