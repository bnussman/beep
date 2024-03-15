import "reflect-metadata";
import * as Sentry from '@sentry/bun';
import config from './mikro-orm.config';
import { SENTRY_URL, ENVIRONMENT } from './utils/constants';
import { useSentry } from '@envelop/sentry'
import { makeHandler } from "graphql-ws/lib/use/bun";
import { MikroORM } from "@mikro-orm/core";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
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
import { PaymentsResolver } from "./payments/resolver";
import { pubSub } from "./utils/pubsub";
import { createYoga } from "graphql-yoga";
import { getContext, onConnect } from "./utils/context";
import { handlePaymentWebook } from "./utils/payments";
import { FileScaler } from "./utils/scalers";
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';

Sentry.init({
  dsn: SENTRY_URL,
  environment: ENVIRONMENT || "development",
  tracesSampleRate: 1.0,
  debug: false,
  autoSessionTracking: true,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.GraphQL(),
    new Sentry.Integrations.Postgres(),
  ],
  tracesSampler: (samplingContext) => {
    if (samplingContext.request?.method === 'OPTIONS') {
      return false;
    }
    return true;
  },
});

async function start() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);

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
    scalarsMap: [{ type: File, scalar: FileScaler }],
  });

  const yoga = createYoga({
    schema,
    context: (data) => getContext(data, orm),
    plugins: [useSentry({ startTransaction: false, renameTransaction: true, includeRawResult: true, includeResolverArgs: true })]
  });

  const websocketHandler = makeHandler({
    schema,
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onConnect: (ctx) => onConnect(ctx, orm),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
        ...ctx,
        req: ctx.extra.request,
        socket: ctx.extra.socket,
        params: msg.payload
      })

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe
        }
      }

      const errors = validate(args.schema, args.document)
      if (errors.length) return errors
      return args
    },
  })

  Bun.serve({
    fetch: (request, server) => {
      // Upgrade the request to a WebSocket
      if (server.upgrade(request)) {
        return new Response();
      }
      // Handle payments webhook
      if (request.url.endsWith("/payments/webhook")) {
        return handlePaymentWebook(request, orm);
      }
      // Handle GraphQL
      return yoga.fetch(request, server);
    },
    port: 3000,
    websocket: websocketHandler,
  });

  console.info(`🚕 Beep GraphQL Server Started at \x1b[36mhttp://0.0.0.0:3000/graphql\x1b[0m`);
}

start();
