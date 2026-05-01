import * as Sentry from "@sentry/bun";
import { db } from "./db";
import { Context as WSContext } from "graphql-ws";

interface ContextFnData {
  request?: Request;
  context?: WSContext;
}

export async function createContext(data: ContextFnData) {
  const bearerToken =
    (data.context?.connectionParams?.token as string) ??
    data.request?.headers.get("authorization")?.split(" ")[1] ??
    "";

  if (!bearerToken) {
    return {};
  }

  const session = await db.query.token.findFirst({
    where: { id: bearerToken },
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
