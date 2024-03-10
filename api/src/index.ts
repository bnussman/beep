import "reflect-metadata";
import "dotenv/config";
import config from './mikro-orm.config';
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
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { pubSub } from "./utils/pubsub";
import { createYoga } from "graphql-yoga";
import { getContext, onConnect } from "./utils/context";
import { GraphQLUpload } from "graphql-upload-minimal";
import { GraphQLScalarType, Kind } from "graphql";

export const FileScaler = new GraphQLScalarType({
  name: "File",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    throw new Error("File scaler not fully implemented");
  },
  parseValue(value: unknown): File {
    return value as File;
  },
  parseLiteral(ast) {
    throw new Error("File scaler not fully implemented");
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

  const yoga = createYoga({ schema, context: (data) => getContext(data, orm) });

  const websocketHandler = makeHandler({
    schema,
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onConnect: (ctx) => onConnect(ctx, orm),
    onSubscribe: async (ctx, msg) => {
      const {schema, execute, subscribe, contextFactory, parse, validate} = yoga.getEnveloped({
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

  const server = Bun.serve({
    fetch: (request, server) => {
      // Upgrade the request to a WebSocket
      if (server.upgrade(request)) {
        return new Response();
      }
      return yoga.fetch(request, server);
    },
    port: 3000,
    websocket: websocketHandler,
  });

  console.info(`🚕 Beep GraphQL Server Started at \x1b[36mhttp://0.0.0.0:3000/graphql\x1b[0m`);
}

start();
