import "reflect-metadata";
import "dotenv/config";
import "@sentry/tracing";
import Redis from 'ioredis';
import express from "express";
import config from './mikro-orm.config';
import ws from 'ws';
import cors from 'cors';
import { json } from 'body-parser';
import * as Sentry from "./utils/sentry";
import * as RealSentry from "@sentry/node";
import { MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "./entities/TokenEntry";
import { GraphQLSchema } from "graphql";
import { buildSchema } from 'type-graphql';
import { authChecker, LeakChecker } from "./utils/authentication";
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

  const schema: GraphQLSchema = await buildSchema({
    resolvers: [__dirname + '/**/resolver.{ts,js}'],
    authChecker: authChecker,
    globalMiddlewares: [LeakChecker],
    pubSub
  });

  app.use(graphqlUploadExpress({ maxFiles: 1 }));

  const server = new ApolloServer<APIContext>({
    schema,
    formatError,
    // context: (ctx) => getContext(ctx, orm),
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

  app.use(RealSentry.Handlers.errorHandler());

  await new Promise<void>(resolve => httpServer.listen({ port: 3001 }, resolve));

  console.info(`🚕 Beep GraphQL Server Started at \x1b[36mhttp://0.0.0.0:3001/graphql\x1b[0m`);
}

start();
