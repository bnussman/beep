import { eq } from "drizzle-orm";
import { user } from "../../drizzle/schema";
import { builder } from "../builder";
import { S3_BUCKET_URL } from "../utils/constants";
import { db } from "../utils/db";
import { pubSub } from "../utils/pubsub";
import { s3 } from "../utils/s3";
import * as Sentry from "@sentry/bun";

export const UserRef = builder.drizzleObject("user", {
  name: "User",
  fields: (t) => ({
    id: t.exposeString("id"),
    fullName: t.string({
      resolve: (user, args, ctx, info) => `${user.first} ${user.last}`,
    }),
    first: t.exposeString("first"),
    last: t.exposeString("last"),
    capacity: t.exposeInt("capacity"),
    singlesRate: t.exposeInt("singlesRate"),
    groupRate: t.exposeInt("groupRate"),
    phone: t.exposeString("phone"),
    email: t.exposeString("email"),
    cashapp: t.exposeString("cashapp"),
    venmo: t.exposeString("venmo"),
    photo: t.exposeString("photo"),
    pushToken: t.exposeString("pushToken", {
      authScopes: {
        admin: true,
      },
    }),
    rating: t.float({
      resolve(user) {
        if (user.rating === null) {
          return null;
        }
        return Number(user.rating);
      },
    }),
    role: t.exposeString("role"),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.drizzleField({
      type: "user",
      authScopes: {
        loggedIn: true,
      },
      resolve: (query, root, args, ctx) =>
        db.query.user.findFirst(
          query({
            where: {
              id: ctx.user!.id,
            },
          }),
        ),
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    uploadProfilePicture: t.drizzleField({
      type: "user",
      authScopes: {
        loggedIn: true,
      },
      args: {
        photo: t.arg({ type: "File", required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        const extention = args.photo.name.substring(
          args.photo.name.lastIndexOf("."),
          args.photo.name.length,
        );

        const filename = ctx.user!.id + "-" + Date.now() + extention;

        const objectKey = "images/" + filename;

        await s3.write(objectKey, args.photo, { acl: "public-read" });

        if (ctx.user!.photo) {
          const key = ctx.user!.photo.split(S3_BUCKET_URL)[1];

          if (key) {
            s3.delete(key);
          } else {
            Sentry.captureMessage(
              "Unable to delete profile photo from S3 due to invalid URL format",
            );
          }
        }

        const u = await db
          .update(user)
          .set({ photo: S3_BUCKET_URL + objectKey })
          .where(eq(user.id, ctx.user!.id))
          .returning();

        pubSub.publish("user", ctx.user!.id, { user: u[0] });

        return u[0];
      },
    }),
  }),
});

builder.subscriptionType({
  fields: (t) => ({
    userSubscription: t.field({
      type: UserRef,
      authScopes: {
        loggedIn: true,
      },
      nullable: false,
      args: {
        userId: t.arg.string(),
      },
      subscribe: (_parent, args, ctx) =>
        pubSub.subscribe("user", args.userId ?? ctx.user!.id),
      resolve: (user) => user.user,
    }),
  }),
});
