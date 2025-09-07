import * as Sentry from "@sentry/bun";
import { TRPCError, inferRouterInputs, initTRPC } from "@trpc/server";
import z, { ZodError } from "zod";
import { AppRouter } from "..";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "./db";
import { beep, token } from "../../drizzle/schema";
import { and, eq, or } from "drizzle-orm";

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
        fieldErrors:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? (z.flattenError(error.cause).fieldErrors as Record<
                string,
                string[]
              >)
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

const replacementMap = {
  phone: "",
  email: "",
  password: "",
  passwordType: "",
  role: "",
  pushToken: null,
  location: null,
  created: null,
};

const inProgressBeepFields = ["phone", "location"];
const adminOnlyFields = [
  "email",
  "pushToken",
  "password",
  "passwordType",
  "role",
  "created",
];

async function removePersonalData(data: any, requestingUser: Context["user"]) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      await removePersonalData(data[i], requestingUser);
    }
  } else if (typeof data === "object") {
    let hasBeepedWithUser: boolean | null = null;

    for (const key in data) {
      if (
        adminOnlyFields.includes(key) &&
        (!requestingUser || requestingUser.role !== "admin")
      ) {
        data[key] = replacementMap[key as keyof typeof replacementMap];
      }
      if (inProgressBeepFields.includes(key)) {
        const userId = data.id;
        if (!userId) {
          throw new Error(
            "No user ID in object so we can't perform permission checks",
          );
        }
        if (requestingUser && requestingUser.id === userId) {
          continue;
        }
        if (requestingUser?.role === "admin") {
          continue;
        }
        if (hasBeepedWithUser === null && requestingUser) {
          console.log(
            "Checking Permissions when resolving",
            userId,
            "'s ",
            key,
            "for requesting user",
            requestingUser.username,
          );
          hasBeepedWithUser =
            (await db.$count(
              beep,
              and(
                or(
                  and(
                    eq(beep.beeper_id, requestingUser.id),
                    eq(beep.rider_id, userId),
                  ),
                  and(
                    eq(beep.rider_id, requestingUser.id),
                    eq(beep.beeper_id, userId),
                  ),
                ),
                or(
                  eq(beep.status, "accepted"),
                  eq(beep.status, "on_the_way"),
                  eq(beep.status, "here"),
                  eq(beep.status, "in_progress"),
                  // eq(beep.status, "complete"),
                  // eq(beep.status, "canceled"),
                ),
              ),
            )) > 0;
        }
        if (!hasBeepedWithUser) {
          data[key] = replacementMap[key as keyof typeof replacementMap];
        }
      }
    }
  }
}

const protectUserInfoMiddleware = t.middleware(async (opts) => {
  const result = await opts.next(opts);

  if (result.ok && opts.path !== "rider.beepersNearMe") {
    await removePersonalData(result.data, opts.ctx.user);
    console.log("-> Protecting", opts.path, " - ", result);
  }

  return result;
});

export const publicProcedure = t.procedure
  .use(sentryMiddleware)
  .use(protectUserInfoMiddleware);

export const authedProcedure = publicProcedure.use(function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.user || !ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({ ctx });
});

export const verifiedProcedure = authedProcedure.use(function isVerified(opts) {
  const { ctx } = opts;

  if (!ctx.user.isStudent || !ctx.user.isEmailVerified) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Your edu email must be verified.",
    });
  }

  return opts.next({ ctx });
});

export const adminProcedure = authedProcedure.use(function isAdmin(opts) {
  const { ctx } = opts;

  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({ ctx });
});

export async function createContext(
  data: Omit<FetchCreateContextFnOptions, "resHeaders">,
) {
  const bearerToken =
    data.req?.headers.get("authorization")?.split(" ")[1] ??
    data.info?.connectionParams?.token;

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
      },
    },
  });

  if (!session) {
    return {};
  }

  Sentry.setUser(session.user);

  return { user: session.user, token: session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
