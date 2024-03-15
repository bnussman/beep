import * as Sentry from "@sentry/bun";
import { Context as WSContext } from "graphql-ws";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Token } from "../entities/Token";
import { User } from "../entities/User";
import { YogaInitialContext } from "graphql-yoga";

export interface Context {
  em: MikroORM<PostgreSqlDriver>['em'];
  user: User;
  token: Token;
}

export async function getContext(data: YogaInitialContext, orm: MikroORM<PostgreSqlDriver>): Promise<Context> {
  // Sentry.configureScope(scope => scope.setTransactionName(data.req.body?.operationName));

  const em = orm.em.fork();

  const context = { em };

  if (!data.request) {
    // This is a websocket. Handle auth in the onConnext, and pass context through.
    console.log("Getting context for websocket connextion")
    // @ts-expect-error
    const token = data.extra.token as Token;
    return { em, token, user: token.user };
  }

  const bearer = data.request.headers.get("Authorization")?.split(" ")[1];

  if (!bearer) {
    return context as Context;
  }

  const token = await em.findOne(
    Token,
    bearer,
    {
      populate: ['user'],
    }
  );

  if (token?.user) {
    Sentry.setUser(token.user);

    return { user: token.user, token, em };
  }

  return context as Context;
}

export async function onConnect(ctx: WSContext<any, any>, orm: MikroORM<IDatabaseDriver<Connection>>) {
  const bearer = ctx.connectionParams?.token;

  if (!bearer) {
    return true;
  }

  const token = await orm.em.fork().findOne(
    Token,
    bearer,
    {
      populate: ['user'],
    }
  );

  if (token) {
    ctx.extra.token = token;
    return { user: token.user };
  }
}
