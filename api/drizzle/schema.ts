import { pgTable, foreignKey, varchar, integer, boolean, timestamp, index, unique, numeric, geometry, pgEnum } from "drizzle-orm/pg-core"

export const beepStatus = pgEnum("beep_status", ['canceled', 'denied', 'waiting', 'accepted', 'on_the_way', 'here', 'in_progress', 'complete'])
export const paymentProduct = pgEnum("payment_product", ['top_of_beeper_list_1_hour', 'top_of_beeper_list_2_hours', 'top_of_beeper_list_3_hours'])
export const paymentStore = pgEnum("payment_store", ['play_store', 'app_store'])
export const userPasswordType = pgEnum("user_password_type", ['sha256', 'bcrypt'])
export const userRole = pgEnum("user_role", ['user', 'admin'])

export const car = pgTable("car", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull(),
	make: varchar({ length: 255 }).notNull(),
	model: varchar({ length: 255 }).notNull(),
	color: varchar({ length: 255 }).notNull(),
	photo: varchar({ length: 255 }).notNull(),
	year: integer().notNull(),
	default: boolean().default(false).notNull(),
	created: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	updated: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [user.id],
		name: "car_user_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const feedback = pgTable("feedback", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull(),
	message: varchar({ length: 255 }).notNull(),
	created: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [user.id],
		name: "feedback_user_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const beep = pgTable("beep", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	beeper_id: varchar("beeper_id", { length: 255 }).notNull(),
	rider_id: varchar("rider_id", { length: 255 }).notNull(),
	origin: varchar({ length: 255 }).notNull(),
	destination: varchar({ length: 255 }).notNull(),
	groupSize: integer("group_size").notNull(),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp({ withTimezone: true, mode: 'string' }),
	status: beepStatus().default('waiting').notNull(),
}, (table) => [
	index().using("btree", table.beeper_id.asc().nullsLast().op("text_ops")),
	index().using("btree", table.beeper_id.asc().nullsLast().op("text_ops"), table.rider_id.asc().nullsLast().op("text_ops")),
	index().using("btree", table.rider_id.asc().nullsLast().op("text_ops")),
	index().using("btree", table.start.asc().nullsLast().op("timestamptz_ops")),
	index().using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
		columns: [table.beeper_id],
		foreignColumns: [user.id],
		name: "beep_beeper_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.rider_id],
		foreignColumns: [user.id],
		name: "beep_rider_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const verify_email = pgTable("verify_email", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull(),
	time: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [user.id],
		name: "verify_email_user_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	first: varchar({ length: 255 }).notNull(),
	last: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }).notNull(),
	venmo: varchar({ length: 255 }),
	cashapp: varchar({ length: 255 }),
	password: varchar({ length: 255 }).notNull(),
	passwordType: userPasswordType("password_type").default('bcrypt').notNull(),
	isBeeping: boolean("is_beeping").default(false).notNull(),
	isEmailVerified: boolean("is_email_verified").default(false).notNull(),
	isStudent: boolean("is_student").default(false).notNull(),
	groupRate: integer("group_rate").default(4).notNull(),
	singlesRate: integer("singles_rate").default(3).notNull(),
	capacity: integer().default(4).notNull(),
	queueSize: integer("queue_size").default(0).notNull(),
	rating: numeric(),
	role: userRole().default('user').notNull(),
	pushToken: varchar("push_token", { length: 255 }),
	photo: varchar({ length: 255 }),
	location: geometry(),
	created: timestamp({ withTimezone: true, mode: 'date' }),
}, (table) => [
	unique("user_username_unique").on(table.username),
	unique("user_email_unique").on(table.email),
]);

export const forgot_password = pgTable("forgot_password", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull(),
	time: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [user.id],
		name: "forgot_password_user_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const payment = pgTable("payment", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull(),
	store_id: varchar("store_id", { length: 255 }).notNull(),
	product_id: paymentProduct("product_id").notNull(),
	price: numeric().notNull(),
	store: paymentStore().notNull(),
	created: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [user.id],
		name: "payment_user_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const rating = pgTable("rating", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	rater_id: varchar("rater_id", { length: 255 }).notNull(),
	rated_id: varchar("rated_id", { length: 255 }).notNull(),
	stars: integer().notNull(),
	message: varchar({ length: 255 }),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	beep_id: varchar("beep_id", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.beep_id],
		foreignColumns: [beep.id],
		name: "rating_beep_id_beep_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.rated_id],
		foreignColumns: [user.id],
		name: "rating_rated_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.rater_id],
		foreignColumns: [user.id],
		name: "rating_rater_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
	unique("rating_beep_id_rater_id_unique").on(table.rater_id, table.beep_id),
]);

export const report = pgTable("report", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	reporterId: varchar("reporter_id", { length: 255 }).notNull(),
	reportedId: varchar("reported_id", { length: 255 }).notNull(),
	handledById: varchar("handled_by_id", { length: 255 }),
	reason: varchar({ length: 255 }).notNull(),
	notes: varchar({ length: 255 }),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	handled: boolean().default(false).notNull(),
	beepId: varchar("beep_id", { length: 255 }),
}, (table) => [
	foreignKey({
		columns: [table.beepId],
		foreignColumns: [beep.id],
		name: "report_beep_id_beep_id_fk"
	}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
		columns: [table.handledById],
		foreignColumns: [user.id],
		name: "report_handled_by_id_user_id_fk"
	}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
		columns: [table.reportedId],
		foreignColumns: [user.id],
		name: "report_reported_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.reporterId],
		foreignColumns: [user.id],
		name: "report_reporter_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const token = pgTable("token", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	tokenid: varchar({ length: 255 }).notNull(),
	user_id: varchar("user_id", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [user.id],
		name: "token_user_id_user_id_fk"
	}).onUpdate("cascade").onDelete("cascade"),
]);
