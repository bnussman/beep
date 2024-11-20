import * as Sentry from '@sentry/bun';
import { TRPCError, inferRouterInputs, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { AppRouter } from '..';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from './db';
import { token } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;

export const publicProcedure = t.procedure.use((opts) => {
  Sentry.getCurrentScope().setExtra("trpc", true);
  return opts.next(opts);
});

export const authedProcedure = publicProcedure.use(function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.user || !ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({ ctx });
});
export const verifiedProcedure = authedProcedure.use(function isVerified(opts) {
  const { ctx } = opts;

  if (!ctx.user.isStudent || !ctx.user.isEmailVerified) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Your edu email must be verified.'
    });
  }

  return opts.next({ ctx });
});

export const adminProcedure = authedProcedure.use(function isAdmin(opts) {
  const { ctx } = opts;

    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({ ctx });
})

export async function createContext(data: Omit<FetchCreateContextFnOptions, 'resHeaders'>) {
  const bearerToken = data.req?.headers.get('authorization')?.split(' ')[1] ?? data.info?.connectionParams?.token;

  if (!bearerToken) {
    return {};
  }

  const session = await db.query.token.findFirst({
    where: eq(token.id, bearerToken),
    with: {
      user: {
        columns: {
          password: false,
          passwordType: false,
        },
      }
    }
  });

  if (!session) {
    return {};
  }

  Sentry.setUser(session.user);

  return { user: session.user, token: session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
