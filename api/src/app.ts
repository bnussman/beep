import { MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "./entities/TokenEntry";
import { GraphQLSchema } from "graphql";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
import { ORM } from "./utils/ORM";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import config from './mikro-orm.config';
import { ValidationError } from 'class-validator';
import * as Sentry from "./utils/sentry";
import * as RealSentry from "@sentry/node";
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer } from "apollo-server-express";

export const BeepORM = {} as ORM;

export default class BeepAPIServer {

  constructor() {
    this.setup();
  }

  private async setup(): Promise<void> {

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

    const schema: GraphQLSchema = await buildSchema({
      resolvers: [__dirname + '/**/resolver.{ts,js}'],
      authChecker: authChecker,
      pubSub: new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options)
      })
    });

    app.use(
      graphqlUploadExpress({
        maxFileSize: 100000000,
        maxFiles: 1
      })
    );

    const subscriptionServer = SubscriptionServer.create({
      schema,
      execute,
      subscribe,
      onConnect: async (params: { token: string }) => {
          if (!params || !params.token) throw new Error("No auth token");

          const tokenEntryResult = await BeepORM.em.findOne(TokenEntry, params.token, { populate: ['user'] });

          if (tokenEntryResult) return { user: tokenEntryResult.user, token: tokenEntryResult };
        }
      },
      {
        server: httpServer,
        path: '/subscriptions',
      });


    const server = new ApolloServer({
      schema,
      context: async (data) => {
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

        Sentry.captureError(error);

        return error;
      },
      plugins: [{
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }],
    });

    await server.start();

    server.applyMiddleware({ app });

    app.use(RealSentry.Handlers.errorHandler());

    httpServer.listen(3001, () => {
      console.info(`🚕 API Server ready and has started! ${server.graphqlPath}`);
    });
  }
}
