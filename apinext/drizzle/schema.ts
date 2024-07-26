import { pgTable, integer, text, varchar, serial, timestamp, unique, boolean, numeric, geometry, foreignKey, index } from "drizzle-orm/pg-core"

export const spatial_ref_sys = pgTable("spatial_ref_sys", {
	srid: integer("srid").primaryKey().notNull(),
	auth_name: varchar("auth_name", { length: 256 }),
	auth_srid: integer("auth_srid"),
	srtext: varchar("srtext", { length: 2048 }),
	proj4text: varchar("proj4text", { length: 2048 }),
});

export const mikro_orm_migrations = pgTable("mikro_orm_migrations", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	executed_at: timestamp("executed_at", { withTimezone: true, mode: 'string' }).defaultNow(),
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
	password_type: text("password_type").default('sha256').notNull(),
	is_beeping: boolean("is_beeping").default(false).notNull(),
	is_email_verified: boolean("is_email_verified").default(false).notNull(),
	is_student: boolean("is_student").default(false).notNull(),
	group_rate: integer("group_rate").default(4).notNull(),
	singles_rate: integer("singles_rate").default(3).notNull(),
	capacity: integer("capacity").default(4).notNull(),
	queue_size: integer("queue_size").default(0).notNull(),
	rating: numeric("rating"),
	role: text("role").default('user').notNull(),
	push_token: varchar("push_token", { length: 255 }),
	photo: varchar("photo", { length: 255 }),
	location: geometry("location"),
	created: timestamp("created", { withTimezone: true, mode: 'string' }),
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

export const payment = pgTable("payment", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	store_id: varchar("store_id", { length: 255 }).notNull(),
	product_id: text("product_id").notNull(),
	price: numeric("price").notNull(),
	store: text("store").notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
});

export const forgot_password = pgTable("forgot_password", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
});

export const feedback = pgTable("feedback", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	message: varchar("message", { length: 255 }).notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
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
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	updated: timestamp("updated", { withTimezone: true, mode: 'string' }).notNull(),
});

export const beep = pgTable("beep", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	beeper_id: varchar("beeper_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	rider_id: varchar("rider_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	origin: varchar("origin", { length: 255 }).notNull(),
	destination: varchar("destination", { length: 255 }).notNull(),
	group_size: integer("group_size").notNull(),
	start: timestamp("start", { withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp("end", { withTimezone: true, mode: 'string' }),
	status: text("status").default('complete').notNull(),
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
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).notNull(),
	handled: boolean("handled").default(false).notNull(),
	beep_id: varchar("beep_id", { length: 255 }).references(() => beep.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const rating = pgTable("rating", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	rater_id: varchar("rater_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	rated_id: varchar("rated_id", { length: 255 }).notNull().references(() => user.id, { onUpdate: "cascade" } ),
	stars: integer("stars").notNull(),
	message: varchar("message", { length: 255 }),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).notNull(),
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
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
});
