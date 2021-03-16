import { initializeSentry } from "./utils/sentry";
import { MikroORM } from "@mikro-orm/core";
import { TokenEntry } from "./entities/TokenEntry";
import { User } from "./entities/User";
import { VerifyEmail } from "./entities/VerifyEmail";
import { QueueEntry } from "./entities/QueueEntry";
import { Beep } from "./entities/Beep";
import { ForgotPassword } from "./entities/ForgotPassword";
import { Report } from "./entities/Report";
import { Location } from "./entities/Location";
import { GraphQLSchema } from "graphql";
import { buildSchema } from 'type-graphql';
import { authChecker } from "./utils/authentication";
import { Rating } from "./entities/Rating";
import { ORM } from "./utils/ORM";
import { RedisCacheAdapter } from 'mikro-orm-cache-adapter-redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import { graphqlUploadKoa } from 'graphql-upload'
import koaBody from 'koa-bodyparser';
import cors from '@koa/cors';

const url = `mongodb+srv://banks:${process.env.MONGODB_PASSWORD}@beep.5zzlx.mongodb.net/test?retryWrites=true&w=majority`;

const prod = process.env.GITLAB_ENVIRONMENT_NAME;

export const BeepORM = {} as ORM;

export default class BeepAPIServer {

    constructor() {
        this.setup();
    }


    private async setup(): Promise<void> {
        const options = {
            host: '192.168.1.135',
            port: 6379,
            password: 'jJHBYlvrfbcuPrJsym7ZXYKCKPpAtoiDEYduKaYlDxJFvZ+QvtHxpIQM5N/+9kPEzuDWAvHA4vgSUu0q'
        };

        BeepORM.orm = await MikroORM.init({
            entities: ['./build/entities/*.js'],
            entitiesTs: ['./src/entities/*.ts'],
            dbName: 'beep',
            type: 'mongo',
            clientUrl: url,
            debug: true,
            resultCache: {
                adapter: RedisCacheAdapter,
                expiration: 60000, // 1s
                options: {
                    client: new Redis(options)
                }
            }
        });

        BeepORM.em = BeepORM.orm.em;
        BeepORM.userRepository = BeepORM.orm.em.getRepository(User);
        BeepORM.tokenRepository = BeepORM.orm.em.getRepository(TokenEntry);
        BeepORM.verifyEmailRepository = BeepORM.orm.em.getRepository(VerifyEmail);
        BeepORM.queueEntryRepository = BeepORM.orm.em.getRepository(QueueEntry);
        BeepORM.beepRepository = BeepORM.orm.em.getRepository(Beep);
        BeepORM.forgotPasswordRepository = BeepORM.orm.em.getRepository(ForgotPassword);
        BeepORM.reportRepository = BeepORM.orm.em.getRepository(Report);
        BeepORM.locationRepository = BeepORM.orm.em.getRepository(Location);
        BeepORM.ratingRepository = BeepORM.orm.em.getRepository(Rating);

        initializeSentry();


        const schema: GraphQLSchema = await buildSchema({
            resolvers: [__dirname + '/**/resolver.{ts,js}'],
            authChecker: authChecker,
            pubSub: new RedisPubSub({
                publisher: new Redis(options),
                subscriber: new Redis(options)
            })
        });

        const app = new Koa();

        app.use(koaBody());
        app.use(cors());

        app.use(
            graphqlUploadKoa({
                maxFileSize: 100000000, // 10 MB
                maxFiles: 20
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
                if (!ctx) return;

                const authHeader = ctx.request.header.authorization;
                if (!authHeader) {
                    return;
                }

                const token: string | undefined = authHeader.split(" ")[1];

                if (!token) return;

                const tokenEntryResult = await BeepORM.em.findOne(TokenEntry, token, { populate: ['user'] });

                if (tokenEntryResult) return { user: tokenEntryResult.user, token: tokenEntryResult };
            }
        });

        server.applyMiddleware({ app });

        const live = app.listen(3001, () => {
            console.info(`🚕 Server ready and has started! ${server.graphqlPath}`);
        });
        server.installSubscriptionHandlers(live);
    }
}
