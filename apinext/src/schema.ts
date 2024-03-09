import { pgTable, integer, text, varchar, timestamp, unique, boolean, numeric, index } from "drizzle-orm/pg-core";
import { customType } from 'drizzle-orm/pg-core';
import { relations } from "drizzle-orm";

interface Point {
  latitude: number;
  longitude: number;
}

const geography = customType<{ data: Point }>({
  dataType() {
    return 'geography';
  },
  toDriver(value) {
    return `point(${value.latitude} ${value.longitude})`;
  },
  fromDriver(value: any): Point {
    if (value.coordinates)  {
      return { latitude: value.coordinates[0], longitude: value.coordinates[1] };
    }

    throw new Error("error getting location from db");
  }
});

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
	role: text("role").default('user').notNull(),
	pushToken: varchar("push_token", { length: 255 }),
	photo: varchar("photo", { length: 255 }),
	location: geography("location"),
	created: timestamp("created", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		userUsernameUnique: unique("user_username_unique").on(table.username),
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const userRelations = relations(user, ({ many }) => ({
  beepsAsRider: many(beep, { relationName: "rider" }),
  beepsAsBeeper: many(beep, { relationName: "beeper" }),
}));

export const payment = pgTable("payment", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	storeId: varchar("store_id", { length: 255 }).notNull(),
	productId: text("product_id").notNull(),
	price: numeric("price").notNull(),
	store: text("store").notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
});

export const forgotPassword = pgTable("forgot_password", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
});

export const feedback = pgTable("feedback", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	message: varchar("message", { length: 255 }).notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
});

export const car = pgTable("car", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	make: varchar("make", { length: 255 }).notNull(),
	model: varchar("model", { length: 255 }).notNull(),
	color: varchar("color", { length: 255 }).notNull(),
	photo: varchar("photo", { length: 255 }).notNull(),
	year: integer("year").notNull(),
	default: boolean("default").default(false).notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	updated: timestamp("updated", { withTimezone: true, mode: 'string' }).notNull(),
});

export const beep = pgTable("beep", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	beeperId: varchar("beeper_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	riderId: varchar("rider_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	origin: varchar("origin", { length: 255 }).notNull(),
	destination: varchar("destination", { length: 255 }).notNull(),
	groupSize: integer("group_size").notNull(),
	start: timestamp("start", { withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp("end", { withTimezone: true, mode: 'string' }),
	status: text("status").default('complete').notNull(),
},
(table) => {
	return {
		beeperIdIdx: index().on(table.beeperId),
		riderIdIdx: index().on(table.riderId),
		statusIdx: index().on(table.status),
		beeperIdRiderIdIdx: index().on(table.beeperId, table.riderId),
		startIdx: index().on(table.start),
	}
});

export const beepRelations = relations(beep, ({ one }) => ({
  beeper: one(user, {
    fields: [beep.beeperId],
    references: [user.id],
    relationName: "beeper",
  }),
  rider: one(user, {
    fields: [beep.riderId],
    references: [user.id],
    relationName: "rider",
  }),
}));

export const report = pgTable("report", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	reporterId: varchar("reporter_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	reportedId: varchar("reported_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	handledById: varchar("handled_by_id", { length: 255 }).references(() => user.id, { onDelete: "set null", onUpdate: "cascade" } ),
	reason: varchar("reason", { length: 255 }).notNull(),
	notes: varchar("notes", { length: 255 }),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).notNull(),
	handled: boolean("handled").default(false).notNull(),
	beepId: varchar("beep_id", { length: 255 }).references(() => beep.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const rating = pgTable("rating", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	raterId: varchar("rater_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	ratedId: varchar("rated_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	stars: integer("stars").notNull(),
	message: varchar("message", { length: 255 }),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).notNull(),
	beepId: varchar("beep_id", { length: 255 }).notNull().references(() => beep.id, { onUpdate: "cascade" } ),
},
(table) => {
	return {
		ratingBeepIdRaterIdUnique: unique("rating_beep_id_rater_id_unique").on(table.raterId, table.beepId),
	}
});

export const verifyEmail = pgTable("verify_email", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
});

export const token = pgTable("token", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	tokenid: varchar("tokenid", { length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
});

export const tokenRelations = relations(token, ({ one }) => ({
  user: one(user, {
    fields: [token.userId],
    references: [user.id],
  }),
}));