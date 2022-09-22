import * as Sentry from "@sentry/node";
import { ExpressContext } from "apollo-server-express";
import { Context as WSContext } from "graphql-ws";
import { Connection, EntityManager, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "../entities/TokenEntry";
import { User } from "../entities/User";

export interface Context {
    em: EntityManager;
    user: User;
    token: TokenEntry;
}

export async function getContext(data: ExpressContext, orm: MikroORM<IDatabaseDriver<Connection>>) {
  Sentry.configureScope(scope => scope.setTransactionName(data.req.body?.operationName));

  const em = orm.em.fork();

  const context = { em };

  const bearer = data.req.get("Authorization")?.split(" ")[1];

  if (!bearer) {
    return context;
  }

  const token = await em.findOne(
    TokenEntry,
    bearer,
    {
      populate: ['user'],
    }
  );

  if (token?.user) {
    Sentry.setUser(token.user);

    return { user: token.user, token, em };
  }

  return context;
}

export async function onConnect(ctx: WSContext<{ token?: string }, { token?: TokenEntry }>, orm: MikroORM<IDatabaseDriver<Connection>>) {
  const bearer = ctx.connectionParams?.token;

  if (!bearer) {
    return false;
  }

  const token = await orm.em.fork().findOne(
    TokenEntry,
    bearer,
    {
      populate: ['user'],
    }
  );

  if (!token) {
    return false;
  }

  ctx.extra.token = token;
}