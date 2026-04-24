import { builder } from "../builder";
import { db } from "../utils/db";

const UserRef = builder.drizzleObject("user", {
  name: "User",
  fields: (t) => ({
    fullName: t.string({
      resolve: (user, args, ctx, info) => `${user.first} ${user.last}`,
    }),
    first: t.exposeString("first"),
    last: t.exposeString("last"),
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
    currentRide: t.field({
      resolve: async (root, args, ctx) => {
        return await db.query.beep.findFirst();
      },
    }),
  }),
});
