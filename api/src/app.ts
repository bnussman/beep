import { initializeSentry } from "./utils/sentry";
import { MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "./entities/TokenEntry";
import { GraphQLSchema } from "graphql";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
import { ORM } from "./utils/ORM";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { graphqlUploadKoa } from 'graphql-upload';
import koaBody from 'koa-bodyparser';
import cors from '@koa/cors';
import config from './mikro-orm.config';
import * as Sentry from '@sentry/node';

const prod = process.env.GITLAB_ENVIRONMENT_NAME;

export const BeepORM = {} as ORM;

export default class BeepAPIServer {

    constructor() {
        this.setup();
    }

    private async setup(): Promise<void> {

        BeepORM.orm = await MikroORM.init(config);
        BeepORM.em = BeepORM.orm.em;

        initializeSentry();

        const options = {
            host: 'redis-0.nussman.us',
            port: 6379,
            password: 'jJHBYlvrfbcuPrJsym7ZXYKCKPpAtoiDEYduKaYlDxJFvZ+QvtHxpIQM5N/+9kPEzuDWAvHA4vgSUu0q'
        };

        const schema: GraphQLSchema = await buildSchema({
            resolvers: [__dirname + '/**/resolver.{ts,js}'],
            authChecker: authChecker,
            pubSub: !prod ? undefined : new RedisPubSub({
                publisher: new Redis(options),
                subscriber: new Redis(options)
            })
        });

        const app = new Koa();

        app.use(koaBody());
        app.use(cors());

        app.use(
            graphqlUploadKoa({
                maxFileSize: 100000000,
                maxFiles: 1
            })
        );

        const server = new ApolloServer({
            uploads: false,
            schema,
            subscriptions: {
                path: "/subscriptions",
                //@ts-ignore
                onConnect: async (params: { token: string }) => {
                    if (!params || !params.token) throw new Error("No auth token");

                    const tokenEntryResult = await BeepORM.em.findOne(TokenEntry, params.token, { populate: ['user'] });
                    
                    if (tokenEntryResult) return { user: tokenEntryResult.user, token: tokenEntryResult };
                }
            },
            context: async ({ ctx }) => {
                const em = BeepORM.em.fork();
                console.log("r em:", em);

                if (!ctx) return { em };

                const authHeader = ctx.request.header.authorization;

                if (!authHeader) {
                    return { em };
                }

                const token: string | undefined = authHeader.split(" ")[1];

                if (!token) return { em };

                const tokenEntryResult = await em.findOne(TokenEntry, token, { populate: ['user'] });

                if (tokenEntryResult) return { user: tokenEntryResult.user, token: tokenEntryResult, em };

                return { em };
            },
            formatError: (error) => {
                Sentry.captureException(error);
                return error;
            }
        });

        server.applyMiddleware({ app });

        const live = app.listen(3001, () => {
            console.info(`🚕 API Server ready and has started! ${server.graphqlPath}`);
        });

        server.installSubscriptionHandlers(live);
    }
}
