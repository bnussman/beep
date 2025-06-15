import { handlePaymentWebook } from './utils/payments';
import { createYoga } from 'graphql-yoga';
import { token } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { db } from './utils/db';
import { setUser } from '@sentry/bun';
import { builder } from './builder';

const yoga = createYoga({
  schema: builder.toSchema(),
  async context(context) {
    const bearerToken = context.request.headers.get('authorization')?.split(' ')[1];

    if (!bearerToken) {
      return {};
    }

    const session = await db.query.token.findFirst({
      where: eq(token.id, bearerToken),
      with: {
        user: true
      }
    });

    if (!session) {
      return {};
    }

    setUser(session.user);

    return { user: session.user, token: session };
  },
});
 
Bun.serve({
  routes: {
    '/graphql': yoga.fetch,
    '/payments/webhook': handlePaymentWebook,
  },
});

console.info("🚕 Beep GraphQL Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
