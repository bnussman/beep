import * as Sentry from "@sentry/node";
import { Context as WSContext } from "graphql-ws";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { Token } from "../entities/Token";
import { User } from "../entities/User";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import type { MySqlDriver } from "@mikro-orm/mysql";

export interface Context {
    em: MikroORM<MySqlDriver>['em'];
    user: User;
    token: Token;
}

export async function getContext(data: ExpressContextFunctionArgument, orm: MikroORM<MySqlDriver>): Promise<Context> {
  Sentry.configureScope(scope => scope.setTransactionName(data.req.body?.operationName));

  const em = orm.em.fork();

  const context = { em };

  const bearer = data.req.get("Authorization")?.split(" ")[1];

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

export async function onConnect(ctx: WSContext<{ token?: string }, { token?: Token }>, orm: MikroORM<IDatabaseDriver<Connection>>) {
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
