import "reflect-metadata";
import "dotenv/config";
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
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Context } from "graphql-ws";
import { REDIS_HOST, REDIS_PASSWROD } from "./utils/constants";
import { getContext, onConnect } from "./utils/context";
import { formatError } from "./utils/errors";
import { Context as APIContext } from "./utils/context";
import { expressMiddleware } from '@apollo/server/express4';
import { BeepResolver } from "./beeps/resolver";
import { BeeperResolver } from "./beeper/resolver";
import { RatingResolver } from "./rating/resolver";
import { AdminResolver } from "./admin/resolver";
import { ReportsResolver } from "./reports/resolver";
import { FeedbackResolver } from "./feedback/resolver";
import { UserResolver } from "./users/resolver";
import { LocationResolver } from "./location/resolver";
import { CarResolver } from "./cars/resolver";
import { AuthResolver } from "./auth/resolver";
import { RiderResolver } from "./rider/resolver";
import { DirectionsResolver } from "./directions/resolver";
import { paymentHandler } from "./utils/payments";
import { PaymentsResolver } from "./payments/resolver";

const options = {
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  port: 6379,
};

export const pubSub = new RedisPubSub({
  publisher: new Redis(options), subscriber: new Redis(options)
});

async function start() {
  const orm = await MikroORM.init(config);

  const app = express();

  const httpServer = createServer(app);

  Sentry.init(app);

  app.use(RealSentry.Handlers.requestHandler());
  app.use(RealSentry.Handlers.tracingHandler());

  const schema = await buildSchema({
    resolvers: [
      BeepResolver,
      BeeperResolver,
      RatingResolver,
      AdminResolver,
      ReportsResolver,
      FeedbackResolver,
      UserResolver,
      LocationResolver,
      CarResolver,
      AuthResolver,
      RiderResolver,
      AdminResolver,
      DirectionsResolver,
      PaymentsResolver
    ],
    authChecker,
    pubSub,
    validate: true,
  });

  app.use(graphqlUploadExpress({ maxFiles: 1 }));

  const server = new ApolloServer<APIContext>({
    schema,
    formatError,
    csrfPrevention: true,
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

  app.post(
    '/payment',
    cors<cors.CorsRequest>(),
    json(),
    (req, res) => paymentHandler(req, res, orm),
  );

  app.use(RealSentry.Handlers.errorHandler());

  await new Promise<void>(resolve => httpServer.listen({ port: 3000 }, resolve));

  console.info(`🚕 Beep GraphQL Server Started at \x1b[36mhttp://0.0.0.0:3000/graphql\x1b[0m`);
}

start();
