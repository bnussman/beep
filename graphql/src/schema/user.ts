import { eq } from 'drizzle-orm';
import { user } from '../../drizzle/schema';
import { db } from '../utils/db';
import { builder } from '../builder';
import { pubSub } from '../utils/pubsub';
import { User } from '../types';

User.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    first: t.exposeString('first'),
    last: t.exposeString('last'),
    name: t.string({
      resolve: (user) => `${user.first} ${user.last}`,
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    user: t.authField({
      type: User,
      args: {
        id: t.arg.id(),
      },
      authScopes: {
        loggedIn: true,
      },
      resolve: async (root, args, context) => {
        if (!args.id || args.id === context.user.id) {
          return context.user;
        }
        return await db.query.user.findFirst({ where: eq(user.id, args.id) });
      },
    }),
  }),
});

builder.subscriptionType({
  fields: (t) => ({
    userUpdates: t.field({
      type: User,
      args: {
        id: t.arg.string({ required: false })
      },
      authScopes: {
        loggedIn: true,
      },
      subscribe: async function* (root, args, ctx, info) {
        const userId = args.id ?? ctx.user!.id;

        console.log("➕ User subscribed", userId);

        if (ctx.user!.id === userId) {
          yield ctx.user!;
        }

        const eventSource = pubSub.subscribe("user", userId);

        for await (const { user } of eventSource) {
          yield user!;
        }
      },
      resolve: (value) => value as typeof user.$inferSelect,
    }),
  })
});
