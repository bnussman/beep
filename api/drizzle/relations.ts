import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	car: {
		user: r.one.user({
			from: r.car.userId,
			to: r.user.id
		}),
	},
	user: {
		cars: r.many.car(),
		feedbacks: r.many.feedback(),
		verifyEmails: r.many.verifyEmail(),
		forgotPasswords: r.many.forgotPassword(),
		payments: r.many.payment(),
		ratingsRatedId: r.many.rating({
			alias: "rating_ratedId_user_id"
		}),
		ratingsRaterId: r.many.rating({
			alias: "rating_raterId_user_id"
		}),
		reportsHandledById: r.many.report({
			alias: "report_handledById_user_id"
		}),
		reportsReportedId: r.many.report({
			alias: "report_reportedId_user_id"
		}),
		reportsReporterId: r.many.report({
			alias: "report_reporterId_user_id"
		}),
		tokens: r.many.token(),
	},
	feedback: {
		user: r.one.user({
			from: r.feedback.userId,
			to: r.user.id
		}),
	},
	verifyEmail: {
		user: r.one.user({
			from: r.verifyEmail.userId,
			to: r.user.id
		}),
	},
	forgotPassword: {
		user: r.one.user({
			from: r.forgotPassword.userId,
			to: r.user.id
		}),
	},
	payment: {
		user: r.one.user({
			from: r.payment.userId,
			to: r.user.id
		}),
	},
	rating: {
		beep: r.one.beep({
			from: r.rating.beepId,
			to: r.beep.id
		}),
		userRatedId: r.one.user({
			from: r.rating.ratedId,
			to: r.user.id,
			alias: "rating_ratedId_user_id"
		}),
		userRaterId: r.one.user({
			from: r.rating.raterId,
			to: r.user.id,
			alias: "rating_raterId_user_id"
		}),
	},
	beep: {
		ratings: r.many.rating(),
		reports: r.many.report(),
	},
	report: {
		beep: r.one.beep({
			from: r.report.beepId,
			to: r.beep.id
		}),
		userHandledById: r.one.user({
			from: r.report.handledById,
			to: r.user.id,
			alias: "report_handledById_user_id"
		}),
		userReportedId: r.one.user({
			from: r.report.reportedId,
			to: r.user.id,
			alias: "report_reportedId_user_id"
		}),
		userReporterId: r.one.user({
			from: r.report.reporterId,
			to: r.user.id,
			alias: "report_reporterId_user_id"
		}),
	},
	token: {
		user: r.one.user({
			from: r.token.userId,
			to: r.user.id,
			optional: false,
		}),
	},
}))