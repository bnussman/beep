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
import { Token } from "./entities/Token";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createServer } from 'http';
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Context } from "graphql-ws";
import { REDIS_HOST, REDIS_PASSWROD, REVENUE_CAT_WEBHOOK_TOKEN } from "./utils/constants";
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
import { PaymentsResolver, syncUserPayments } from "./payments/resolver";
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import type { Webhook } from "./payments/utils";
import * as trpcExpress from '@trpc/server/adapters/express';
import { TRPCError, initTRPC } from "@trpc/server";
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { z } from "zod";

export type AppRouter = typeof appRouter;

// created for each request
async function createContext(
  opts: CreateHTTPContextOptions | CreateWSSContextFnOptions,
  orm: MikroORM<PostgreSqlDriver>
) {
  const em = orm.em.fork();
  const bearer = opts.req.headers.authorization?.split(" ")[1];

  console.log(opts.req.headers);

  if (!bearer) {
    return { em };
  }

  const token = await em.findOne(
    Token,
    bearer,
    {
      populate: ['user'],
    }
  );

  if (!token) {
    return { em };
  }


  return { user: token.user, token: token, em };
}

type TRPCContext = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<TRPCContext>().create();
const appRouter = t.router({
  user: t.procedure.query(({ ctx }) => {
    return ctx.user;
  }),
  updateUser: t.procedure.input(
    z.object({
      name: z.string(),
    })
  ).mutation(({ input }) => {
    return "OMG!";
  })
});

const options = {
  host: REDIS_HOST,
  password: REDIS_PASSWROD,
  port: 6379,
};

export const pubSub = new RedisPubSub({
  publisher: new Redis(options), subscriber: new Redis(options)
});

async function start() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);

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

  const plugins = [
    ApolloServerPluginDrainHttpServer({ httpServer })
  ];

  const server = new ApolloServer<APIContext>({
    schema,
    formatError,
    csrfPrevention: true,
    plugins,
  });

  const wsServer = new ws.Server({
    server: httpServer,
    path: '/subscriptions',
  });

  /*
  const trpcWSServer = new ws.Server({
    server: httpServer,
    path: '/ws',
    noServer: true,
  });
  */

  useServer({
    schema,
    onConnect: (ctx: Context<{ token?: string }, { token?: Token }>) => onConnect(ctx, orm),
    context: (ctx) => ({
       user: ctx.extra.token?.user,
       token: ctx.extra.token,
       em: orm.em.fork()
    }),
  }, wsServer);

  /*
  applyWSSHandler<AppRouter>({
    wss: trpcWSServer,
    router: appRouter,
    createContext,
  });
  */

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
      createContext: (options) => createContext(options, orm),
    }),
  );

  app.use(
    '/payments/webhook',
    cors<cors.CorsRequest>(),
    json(),
    async (req, res) => {
      const data: Webhook = req.body;

      if (req.headers.authorization !== `Bearer ${REVENUE_CAT_WEBHOOK_TOKEN}`) {
        return res.status(403).json({ error: "Unable to authorize webhook call" });
      }

      try {
        await syncUserPayments(orm.em.fork(), data.event.app_user_id);
      } catch (error) {
        RealSentry.captureException(error);
        return res.status(500).json({ error: error });
      }

      return res.status(200).json({ ok: true });
    }
  );

  app.use(RealSentry.Handlers.errorHandler());

  await new Promise<void>(resolve => httpServer.listen({ port: 3000 }, resolve));

  console.info(`🚕 Beep GraphQL Server Started at \x1b[36mhttp://0.0.0.0:3000/graphql\x1b[0m`);
}

start();
