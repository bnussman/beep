import * as Sentry from '@sentry/bun';
import { TRPCError, inferRouterInputs, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { AppRouter } from '..';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from './db';
import { beep, token } from '../../drizzle/schema';
import { and, desc, eq, or } from 'drizzle-orm';
import { getIsInProgressBeep, isAcceptedBeep } from './beep';

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

const PROTECTED_FIELDS = ['password', 'passwordType', 'pushToken'];

const MUST_BE_IN_ACCEPTED_OR_COMPLETED_BEEP = ['phone', 'email'];

const MUST_BE_IN_IN_PROGRESS_BEEP = ['location', 'cars'];

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

    if (keys.includes('id') && obj['id'] !== ctx.user.id) {

      // Don't let a user see another user's password, pushToken, etc...
      for (const f of PROTECTED_FIELDS) {
        delete obj[f];
      }

      // Get the most recent in progress or complete beep between the requesting user and the user in the
      // response body.
      const b = await db.query.beep.findFirst({ 
        where: and(
          or(isAcceptedBeep, eq(beep.status, 'complete')),
          or(
            and(eq(beep.rider_id, ctx.user.id), eq(beep.beeper_id, obj['id'])),
            and(eq(beep.rider_id, obj['id']), eq(beep.beeper_id, ctx.user.id)),
          )
        ),
        orderBy: desc(beep.start)
      });

      if (b) {
        // If there is an in progrees or completed beep
        if (!getIsInProgressBeep(b)) {
          for (const f of MUST_BE_IN_IN_PROGRESS_BEEP) {
            if (obj[f]) {
          console.log('clearing', f, 'because there is no beep')
              obj[f] = null;
            }
          }
        }
      } else {
        // If there is no in progrees or completed beep between the users, null out the values
        for (const f of [...MUST_BE_IN_ACCEPTED_OR_COMPLETED_BEEP, ...MUST_BE_IN_IN_PROGRESS_BEEP]) {
          if (obj[f]) {
            obj[f] = null;
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
