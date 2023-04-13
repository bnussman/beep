import "reflect-metadata";
import "dotenv/config";
import "@sentry/tracing";
import Redis from 'ioredis';
import express from "express";
import config from './mikro-orm.config';
import ws from 'ws';
import cors from 'cors';
import * as Sentry from "./utils/sentry";
import * as RealSentry from "@sentry/node";
import { json } from 'body-parser';
import { MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "./entities/TokenEntry";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createServer } from 'http';
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Context } from "graphql-ws";
import { REDIS_HOST, REDIS_PASSWROD } from "./utils/constants";
import { getContext, onConnect } from "./utils/context";
import { formatError } from "./utils/errors";
import { Context as APIContext } from "./utils/context";
import { expressMiddleware } from '@apollo/server/express4';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

const t = initTRPC.context<APIContext>().create();

const router = t.router;

const userRouter = router({
  getUser: t.procedure
    .query(({ input, ctx }) => {
      return ctx.user;
    }),
});

const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;

async function start() {
  const orm = await MikroORM.init(config);

  const app = express();

  const httpServer = createServer(app);

  Sentry.init(app);

  app.use(RealSentry.Handlers.requestHandler());
  app.use(RealSentry.Handlers.tracingHandler());

  const options = {
    host: REDIS_HOST,
    password: REDIS_PASSWROD,
    port: 6379,
  };

  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
  });

  const schema = await buildSchema({
    resolvers: [__dirname + '/**/resolver.{ts,js}'],
    authChecker,
    pubSub,
    validate: { forbidUnknownValues: false }
  });

  app.use(graphqlUploadExpress({ maxFiles: 1 }));

  const server = new ApolloServer<APIContext>({
    schema,
    formatError,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  const wsServer = new ws.Server({
    server: httpServer,
    path: '/subscriptions',
  });

  useServer({
    schema,
    onConnect: (ctx: Context<{ token?: string }, { token?: TokenEntry }>) => onConnect(ctx, orm),
    context: (ctx) => ({
       user: ctx.extra.token?.user,
       token: ctx.extra.token,
       em: orm.em.fork()
    }),
  }, wsServer);

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: (ctx) => getContext(ctx, orm),
    }),
  );

  app.use(
    '/trpc',
    cors<cors.CorsRequest>(),
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      async createContext(options) {
        const em = orm.em.fork();

        const context = { em };

        const bearer = options.req.get("Authorization")?.split(" ")[1];

        if (!bearer) {
          return context as APIContext;
        }

        const token = await em.findOne(
          TokenEntry,
          bearer,
          {
            populate: ['user'],
          }
        );

        if (token?.user) {
          return { user: token.user, token, em };
        }

        return context as APIContext;
      },
    }),
  );

  app.use(RealSentry.Handlers.errorHandler());

  await new Promise<void>(resolve => httpServer.listen({ port: 3001 }, resolve));
  

  console.info(`🚕 Beep GraphQL Server Started at \x1b[36mhttp://0.0.0.0:3001/graphql\x1b[0m`);
}


start();
