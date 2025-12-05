import {
  pgTable,
  integer,
  varchar,
  timestamp,
  unique,
  boolean,
  numeric,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import type { CustomTypeValues } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import { Geometry } from "wkx";

export const geography = (dbName: string, fieldConfig?: CustomTypeValues) => {
  return customType<{
    data: { latitude: number; longitude: number } | null;
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

      if (typeof value === "object") {
        const point = value as any;
        return {
          latitude: point.coordinates[0],
          longitude: point.coordinates[1],
        };
      }

      // @ts-expect-error YOUR TYPES ARE SO BAD WHAT ARE YOU DOING??
      const { coordinates } =
        (value as string).charAt(0) == "P"
          ? Geometry.parse(value as string).toGeoJSON()
          : Geometry.parse(Buffer.from(value as string, "hex")).toGeoJSON();

      return { latitude: coordinates[0], longitude: coordinates[1] };
    },
  })(dbName, fieldConfig);
};

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const userPasswordTypeEnum = pgEnum("user_password_type", [
  "sha256",
  "bcrypt",
]);

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    first: varchar("first", { length: 255 }).notNull(),
    last: varchar("last", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    venmo: varchar("venmo", { length: 255 }),
    cashapp: varchar("cashapp", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    passwordType: userPasswordTypeEnum("password_type")
      .default("bcrypt")
      .notNull(),
    isBeeping: boolean("is_beeping").default(false).notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    isStudent: boolean("is_student").default(false).notNull(),
    groupRate: integer("group_rate").default(4).notNull(),
    singlesRate: integer("singles_rate").default(3).notNull(),
    capacity: integer("capacity").default(4).notNull(),
    queueSize: integer("queue_size").default(0).notNull(),
    rating: numeric("rating"),
    role: userRoleEnum("role").default("user").notNull(),
    pushToken: varchar("push_token", { length: 255 }),
    photo: varchar("photo", { length: 255 }),
    location: geography("location"),
    created: timestamp("created", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    unique("user_username_unique").on(table.username),
    unique("user_email_unique").on(table.email),
  ],
);

export const token = pgTable("token", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  tokenid: varchar("tokenid", { length: 255 }).notNull(),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const productEnum = pgEnum("payment_product", [
  "top_of_beeper_list_1_hour",
  "top_of_beeper_list_2_hours",
  "top_of_beeper_list_3_hours",
]);

export const storeEnum = pgEnum("payment_store", ["play_store", "app_store"]);

export const payment = pgTable("payment", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  storeId: varchar("store_id", { length: 255 }).notNull(),
  productId: productEnum("product_id").notNull(),
  price: numeric("price").notNull(),
  store: storeEnum("store").notNull(),
  created: timestamp("created", { withTimezone: true, mode: "date" }).notNull(),
  expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
});

export const forgot_password = pgTable("forgot_password", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  time: timestamp("time", { withTimezone: true, mode: "date" }).notNull(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  message: varchar("message", { length: 255 }).notNull(),
  created: timestamp("created", { withTimezone: true, mode: "date" }).notNull(),
});

export const car = pgTable("car", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  make: varchar("make", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }).notNull(),
  photo: varchar("photo", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  default: boolean("default").default(false).notNull(),
  created: timestamp("created", { withTimezone: true, mode: "date" }).notNull(),
  updated: timestamp("updated", { withTimezone: true, mode: "date" }).notNull(),
});

export const beepStatuses = [
  "canceled",
  "denied",
  "waiting",
  "accepted",
  "on_the_way",
  "here",
  "in_progress",
  "complete",
] as const;

export const beepStatusEnum = pgEnum("beep_status", beepStatuses);

export const beep = pgTable(
  "beep",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    beeper_id: varchar("beeper_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
    rider_id: varchar("rider_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
    origin: varchar("origin", { length: 255 }).notNull(),
    destination: varchar("destination", { length: 255 }).notNull(),
    groupSize: integer("group_size").notNull(),
    start: timestamp("start", { withTimezone: true, mode: "date" }).notNull(),
    end: timestamp("end", { withTimezone: true, mode: "date" }),
    status: beepStatusEnum("status").default("waiting").notNull(),
  },
  (table) => [
    index("beeper_id_idx").using("btree", table.beeper_id),
    index("beeper_id_rider_id_idx").using(
      "btree",
      table.beeper_id,
      table.rider_id,
    ),
    index("rider_id_idx").using("btree", table.rider_id),
    index("start_idx").using("btree", table.start),
    index("status_idx").using("btree", table.status),
  ],
);

export const report = pgTable("report", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  reporter_id: varchar("reporter_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  reported_id: varchar("reported_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  handled_by_id: varchar("handled_by_id", { length: 255 }).references(
    () => user.id,
    { onDelete: "set null", onUpdate: "cascade" },
  ),
  reason: varchar("reason", { length: 255 }).notNull(),
  notes: varchar("notes", { length: 255 }),
  timestamp: timestamp("timestamp", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  handled: boolean("handled").default(false).notNull(),
  beep_id: varchar("beep_id", { length: 255 }).references(() => beep.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const rating = pgTable(
  "rating",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    rater_id: varchar("rater_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
    rated_id: varchar("rated_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
    stars: integer("stars").notNull(),
    message: varchar("message", { length: 255 }),
    timestamp: timestamp("timestamp", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    beep_id: varchar("beep_id", { length: 255 })
      .notNull()
      .references(() => beep.id, { onUpdate: "cascade", onDelete: "cascade" }),
  },
  (table) => [
    unique("rating_beep_id_rater_id_unique").on(table.rater_id, table.beep_id),
  ],
);

export const verify_email = pgTable("verify_email", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  time: timestamp("time", { withTimezone: true, mode: "date" }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});

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
      user: r.one.user({ from: r.payment.user_id, to: r.user.id }),
    },
    forgot_password: {
      user: r.one.user({ from: r.forgot_password.user_id, to: r.user.id }),
    },
    verify_email: {
      user: r.one.user({ from: r.verify_email.user_id, to: r.user.id }),
    },
    feedback: {
      user: r.one.user({ from: r.feedback.user_id, to: r.user.id }),
    },
    car: {
      user: r.one.user({ from: r.car.user_id, to: r.user.id }),
    },
    beep: {
      beeper: r.one.user({
        from: r.beep.beeper_id,
        to: r.user.id,
        alias: "beeper",
      }),
      rider: r.one.user({
        from: r.beep.rider_id,
        to: r.user.id,
        alias: "rider",
      }),
      ratings: r.many.rating({ from: r.beep.id, to: r.rating.beep_id }),
      reports: r.many.report({ from: r.beep.id, to: r.report.beep_id }),
    },
    report: {
      reporter: r.one.user({
        from: r.report.reporter_id,
        to: r.user.id,
        alias: "reporter",
      }),
      reported: r.one.user({
        from: r.report.reported_id,
        to: r.user.id,
        alias: "reported",
      }),
      handledBy: r.one.user({
        from: r.report.handled_by_id,
        to: r.user.id,
        alias: "handler",
      }),
      beep: r.one.beep({ from: r.report.beep_id, to: r.user.id }),
    },
    rating: {
      rater: r.one.user({
        from: r.rating.rater_id,
        to: r.user.id,
        alias: "rater",
      }),
      rated: r.one.user({
        from: r.rating.rated_id,
        to: r.user.id,
        alias: "rated",
      }),
      beep: r.one.user({ from: r.rating.beep_id, to: r.beep.id }),
    },
  }),
);
