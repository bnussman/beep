import Redis from 'ioredis';
import express from "express";
import config from './mikro-orm.config';
import * as Sentry from "./utils/sentry";
import * as RealSentry from "@sentry/node";
import * as unleash from 'unleash-client';
import { MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "./entities/TokenEntry";
import { GraphQLSchema, parse } from "graphql";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
import { ORM } from "./utils/ORM";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ValidationError } from 'class-validator';
import { createServer } from 'http';
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { useServer } from 'graphql-ws/lib/use/ws';
import ws from 'ws';
const WebSocketServer = ws.Server;

export const BeepORM = {} as ORM;

export default class BeepAPIServer {

  constructor() {
    this.setup();
  }

  private async setup(): Promise<void> {

    unleash.initialize({
      url: 'https://gitlab.nussman.us/api/v4/feature_flags/unleash/7',
      instanceId: 'twYnSbSyVvAn-MvsBaBi',
      appName: 'production'
    });

    BeepORM.orm = await MikroORM.init(config);
    BeepORM.em = BeepORM.orm.em;

    const app = express();
    const httpServer = createServer(app);

    Sentry.init(app);

    app.use(RealSentry.Handlers.requestHandler({
      transaction: 'handler'
    }));
    app.use(RealSentry.Handlers.tracingHandler());

    const options = {
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      port: 6379,
    };

    const pubSub = new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options)
    });

    const schema: GraphQLSchema = await buildSchema({
      resolvers: [__dirname + '/**/resolver.{ts,js}'],
      authChecker: authChecker,
      pubSub
    });

    app.use(graphqlUploadExpress({ maxFiles: 1 }));

    const server = new ApolloServer({
      schema,
      context: async (data: ExpressContext) => {
        RealSentry.configureScope(scope => scope.setTransactionName(data.req.body?.operationName));

        const em = BeepORM.em.fork();

        const context = { em };

        const token = data.req.get("Authorization")?.split(" ")[1];

        if (!token) return context;

        const tokenEntryResult = await em.findOne(TokenEntry, token, { populate: ['user'] });

        if (tokenEntryResult) {
          Sentry.setUserContext(tokenEntryResult.user);
          return { user: tokenEntryResult.user, token: tokenEntryResult, em };
        }

        return context;
      },
      formatError: (error) => {
        if (error?.message === "Argument Validation Error") {
          const errors = error?.extensions?.exception?.validationErrors as ValidationError[];

          let output: string[] = [];

          for (const error of errors) {
            if (!error.constraints) continue;

            const items = Object.values<string>(error.constraints);

            output = [...output, ...items];
          }
          return new Error(output.toString());
        }

        return error;
      },
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
        async serverWillStart() {
          return {
            async drainServer() {
              // subscriptionServer.close();
            }
          };
        }
      }],
    });

    await server.start();

    server.applyMiddleware({ app });

    app.use(RealSentry.Handlers.errorHandler());

    const s = httpServer.listen(3001, () => {
      console.info(`🚕 API Server ready and has started! ${server.graphqlPath}`);

      const wsServer = new WebSocketServer({
        server: s,
        path: '/subscriptions',
      });

      useServer({
        schema,
        onConnect: (ctx) => {
          console.log("Client Connected");
        },
        onDisconnect: (ctx) => {
          console.log("Client Disconnected");
        },
        onSubscribe: async (ctx, msg) => {
          const { connectionParams } = ctx;
          
          console.log("Client subscribed for", msg.payload.operationName, connectionParams);

          if (!connectionParams || !connectionParams.token) throw new Error("No auth token");

          const em = BeepORM.em.fork();

          const tokenEntryResult = await em.findOne(TokenEntry, connectionParams.token as string, { populate: ['user'] });

          if (msg.payload.operationName === "UserUpdates") {
            setTimeout(() => pubSub.publish(`User${tokenEntryResult?.user.id}`, tokenEntryResult?.user), 10);
          }

          if (tokenEntryResult) {
            return {
              contextValue: { user: tokenEntryResult.user, token: tokenEntryResult },
              schema,
              document: parse(msg.payload.query),
              variableValues: msg.payload.variables
            }
          }
        },
      }, wsServer);
    });
  }
}
