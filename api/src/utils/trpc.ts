import * as Sentry from '@sentry/bun';
import { TRPCError, inferRouterInputs, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { AppRouter } from '..';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from './db';
import { beep, token } from '../../drizzle/schema';
import { and, eq, getOperators, or } from 'drizzle-orm';

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

const sentryMiddleware = t.middleware((opts) => {
  Sentry.getCurrentScope().setTransactionName(`${opts.type} ${opts.path}`);
  const activeSpan = Sentry.getActiveSpan();
  if (activeSpan) {
    Sentry.updateSpanName(activeSpan, `${opts.type} ${opts.path}`);
  }

  return opts.next();
});

const PROTECTED_FIELDS = ['phone', 'email', 'location', 'password', 'passwordType', 'pushToken'];

async function getProtectedData(obj: any, ctx: Context) {
  if (!ctx.user) {
    console.log('aborting due to no user in ctx')
    return;
  }
  if (ctx.user.role === 'admin') {
    return;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.includes('id') && keys.some(k => PROTECTED_FIELDS.includes(k))) {
      const hasPermission = await db.query.beep.findFirst({ 
        where: and(
          eq(beep.status, 'complete'),
          or(
            and(eq(beep.rider_id, ctx.user.id), eq(beep.beeper_id, obj['id'])),
            and(eq(beep.rider_id, obj['id']), eq(beep.beeper_id, ctx.user.id)),
          )
        )
      });

      if (!hasPermission) {
        console.log('no permission')
        for(const key of keys)  {
          if (PROTECTED_FIELDS.includes(key)) {
            obj[key] = null;
          }
        }
      }
    }
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null)  {
      await getProtectedData(obj[key], ctx);
    }
  }
}

const protectMiddleware = t.middleware(async (opts) => {
  const result = await opts.next();
  if (result.ok && result.data) {
    await getProtectedData(result.data, opts.ctx) 
  }
  return result;
});

export const publicProcedure = t.procedure.use(sentryMiddleware).use(protectMiddleware);

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
