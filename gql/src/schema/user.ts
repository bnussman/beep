import { builder } from "../builder";
import { db } from "../utils/db";
import { pubSub } from "../utils/pubsub";

const UserRef = builder.drizzleObject("user", {
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

builder.mutationType({});

builder.subscriptionType({
  fields: (t) => ({
    userSubscription: t.field({
      type: UserRef,
      nullable: false,
      args: {
        userId: t.arg.string({ required: true }),
      },
      subscribe: (_parent, args, ctx) => pubSub.subscribe("user", args.userId),
      resolve: (user) => user.user,
    }),
  }),
});
