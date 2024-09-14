import { pgTable, integer, text, varchar, timestamp, unique, boolean, numeric, index, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations";
import type { CustomTypeValues } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import type { Point } from "geojson";
import { Geometry } from "wkx";

export const geography = (
  dbName: string,
  fieldConfig?: CustomTypeValues
) => {
  return customType<{
    data: { latitude: number, longitude: number } | null;
  }>({
    dataType() {
      return "geometry";
    },
    toDriver(value) {
      if (!value) {
        return value;
      }

      return `point(${value.latitude} ${value.longitude})`;
    },
    fromDriver(value) {
      if (!value) {
        return null;
      }

      if (typeof value === 'object') {
        const point = value as Point;
        return { latitude: point.coordinates[0], longitude: point.coordinates[1] };
      }

      // @ts-expect-error YOUR TYPES ARE SO BAD WHAT ARE YOU DOING??
      const { coordinates } = (value as string).charAt(0) == 'P' ?
          Geometry.parse(value as string).toGeoJSON() :
          Geometry.parse(Buffer.from(value as string, 'hex')).toGeoJSON();

      return { latitude: coordinates[0], longitude: coordinates[1] };
    },
  })(dbName, fieldConfig);
};

export const userRoleEnum = pgEnum('user_role', [
  'user',
  'admin',
]);

export const user = pgTable("user", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	first: varchar("first", { length: 255 }).notNull(),
	last: varchar("last", { length: 255 }).notNull(),
	username: varchar("username", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 255 }).notNull(),
	venmo: varchar("venmo", { length: 255 }),
	cashapp: varchar("cashapp", { length: 255 }),
	password: varchar("password", { length: 255 }).notNull(),
	passwordType: text("password_type").default('sha256').notNull(),
	isBeeping: boolean("is_beeping").default(false).notNull(),
	isEmailVerified: boolean("is_email_verified").default(false).notNull(),
	isStudent: boolean("is_student").default(false).notNull(),
	groupRate: integer("group_rate").default(4).notNull(),
	singlesRate: integer("singles_rate").default(3).notNull(),
	capacity: integer("capacity").default(4).notNull(),
	queueSize: integer("queue_size").default(0).notNull(),
	rating: numeric("rating"),
	role: userRoleEnum("role").default('user').notNull(),
	pushToken: varchar("push_token", { length: 255 }),
	photo: varchar("photo", { length: 255 }),
	location: geography("location"),
	created: timestamp("created", { withTimezone: true, mode: 'date' }),
},
(table) => {
	return {
		user_username_unique: unique("user_username_unique").on(table.username),
		user_email_unique: unique("user_email_unique").on(table.email),
	}
});

export const token = pgTable("token", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	tokenid: varchar("tokenid", { length: 255 }).notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
});

export const productEnum = pgEnum('payment_product', [
  'top_of_beeper_list_1_hour',
  'top_of_beeper_list_2_hours',
  'top_of_beeper_list_3_hours'
]);

export const storeEnum = pgEnum('payment_store', [
 'play_store',
 'app_store'
]);

export const payment = pgTable("payment", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	storeId: varchar("store_id", { length: 255 }).notNull(),
	productId: productEnum("product_id").notNull(),
	price: numeric("price").notNull(),
	store: storeEnum("store").notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'date' }).notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'date' }).notNull(),
});

export const forgot_password = pgTable("forgot_password", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	time: timestamp("time", { withTimezone: true, mode: 'date' }).notNull(),
});

export const feedback = pgTable("feedback", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	message: varchar("message", { length: 255 }).notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'date' }).notNull(),
});

export const car = pgTable("car", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	make: varchar("make", { length: 255 }).notNull(),
	model: varchar("model", { length: 255 }).notNull(),
	color: varchar("color", { length: 255 }).notNull(),
	photo: varchar("photo", { length: 255 }).notNull(),
	year: integer("year").notNull(),
	default: boolean("default").default(false).notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'date' }).notNull(),
	updated: timestamp("updated", { withTimezone: true, mode: 'date' }).notNull(),
});

export const beepStatusEnum = pgEnum('beep_status', [
  "canceled",
  "denied",
  "waiting",
  "accepted",
  "on_the_way",
  "here",
  "in_progress",
  "complete",
]);

export const beep = pgTable("beep", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	beeper_id: varchar("beeper_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	rider_id: varchar("rider_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	origin: varchar("origin", { length: 255 }).notNull(),
	destination: varchar("destination", { length: 255 }).notNull(),
	groupSize: integer("group_size").notNull(),
	start: timestamp("start", { withTimezone: true, mode: 'date' }).notNull(),
	end: timestamp("end", { withTimezone: true, mode: 'date' }),
	status: beepStatusEnum("status").default('waiting').notNull(),
},
(table) => {
	return {
		beeper_id_idx: index().using("btree", table.beeper_id),
		beeper_id_rider_id_idx: index().using("btree", table.beeper_id, table.rider_id),
		rider_id_idx: index().using("btree", table.rider_id),
		start_idx: index().using("btree", table.start),
		status_idx: index().using("btree", table.status),
	}
});

export const report = pgTable("report", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	reporter_id: varchar("reporter_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	reported_id: varchar("reported_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	handled_by_id: varchar("handled_by_id", { length: 255 }).references(() => user.id, { onDelete: "set null", onUpdate: "cascade" } ),
	reason: varchar("reason", { length: 255 }).notNull(),
	notes: varchar("notes", { length: 255 }),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'date' }).notNull(),
	handled: boolean("handled").default(false).notNull(),
	beep_id: varchar("beep_id", { length: 255 }).references(() => beep.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const rating = pgTable("rating", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	rater_id: varchar("rater_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	rated_id: varchar("rated_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	stars: integer("stars").notNull(),
	message: varchar("message", { length: 255 }),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'date' }).notNull(),
	beep_id: varchar("beep_id", { length: 255 }).notNull().references(() => beep.id, { onUpdate: "cascade" } ),
},
(table) => {
	return {
		rating_beep_id_rater_id_unique: unique("rating_beep_id_rater_id_unique").on(table.rater_id, table.beep_id),
	}
});

export const verify_email = pgTable("verify_email", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	time: timestamp("time", { withTimezone: true, mode: 'date' }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
});


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
	beeps: many(beep, {
		relationName: "beep_beeper_id_user_id"
	}),
	rides: many(beep, {
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

export const beepRelations = relations(beep, ({ one, many }) => ({
	beeper: one(user, {
		fields: [beep.beeper_id],
		references: [user.id],
		relationName: "beep_beeper_id_user_id"
	}),
	rider: one(user, {
		fields: [beep.rider_id],
		references: [user.id],
		relationName: "beep_rider_id_user_id"
	}),
	reports: many(report),
	ratings: many(rating),
}));

export const reportRelations = relations(report, ({ one }) => ({
	reporter: one(user, {
		fields: [report.reporter_id],
		references: [user.id],
		relationName: "report_reporter_id_user_id"
	}),
	reported: one(user, {
		fields: [report.reported_id],
		references: [user.id],
		relationName: "report_reported_id_user_id"
	}),
	handledBy: one(user, {
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
	rater: one(user, {
		fields: [rating.rater_id],
		references: [user.id],
		relationName: "rating_rater_id_user_id"
	}),
	rated: one(user, {
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
