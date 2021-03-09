"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeepORM = void 0;
const sentry_1 = require("./utils/sentry");
const core_1 = require("@mikro-orm/core");
const TokenEntry_1 = require("./entities/TokenEntry");
const User_1 = require("./entities/User");
const VerifyEmail_1 = require("./entities/VerifyEmail");
const QueueEntry_1 = require("./entities/QueueEntry");
const Beep_1 = require("./entities/Beep");
const ForgotPassword_1 = require("./entities/ForgotPassword");
const Report_1 = require("./entities/Report");
const Location_1 = require("./entities/Location");
const type_graphql_1 = require("type-graphql");
const authentication_1 = require("./utils/authentication");
const apollo_server_1 = require("apollo-server");
const Rating_1 = require("./entities/Rating");
const mikro_orm_cache_adapter_redis_1 = require("mikro-orm-cache-adapter-redis");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = __importDefault(require("ioredis"));
const url = `mongodb+srv://banks:${process.env.MONGODB_PASSWORD}@beep.5zzlx.mongodb.net/test?retryWrites=true&w=majority`;
exports.BeepORM = {};
class BeepAPIServer {
    constructor() {
        this.setup();
    }
    async setup() {
        exports.BeepORM.orm = await core_1.MikroORM.init({
            entities: ['./build/entities/*.js'],
            entitiesTs: ['./src/entities/*.ts'],
            dbName: 'beep',
            type: 'mongo',
            clientUrl: url,
            debug: true,
            resultCache: {
                adapter: mikro_orm_cache_adapter_redis_1.RedisCacheAdapter,
                options: {
                    host: '192.168.1.135',
                    port: 6379,
                    password: 'jJHBYlvrfbcuPrJsym7ZXYKCKPpAtoiDEYduKaYlDxJFvZ+QvtHxpIQM5N/+9kPEzuDWAvHA4vgSUu0q'
                }
            }
        });
        exports.BeepORM.em = exports.BeepORM.orm.em;
        exports.BeepORM.userRepository = exports.BeepORM.orm.em.getRepository(User_1.User);
        exports.BeepORM.tokenRepository = exports.BeepORM.orm.em.getRepository(TokenEntry_1.TokenEntry);
        exports.BeepORM.verifyEmailRepository = exports.BeepORM.orm.em.getRepository(VerifyEmail_1.VerifyEmail);
        exports.BeepORM.queueEntryRepository = exports.BeepORM.orm.em.getRepository(QueueEntry_1.QueueEntry);
        exports.BeepORM.beepRepository = exports.BeepORM.orm.em.getRepository(Beep_1.Beep);
        exports.BeepORM.forgotPasswordRepository = exports.BeepORM.orm.em.getRepository(ForgotPassword_1.ForgotPassword);
        exports.BeepORM.reportRepository = exports.BeepORM.orm.em.getRepository(Report_1.Report);
        exports.BeepORM.locationRepository = exports.BeepORM.orm.em.getRepository(Location_1.Location);
        exports.BeepORM.ratingRepository = exports.BeepORM.orm.em.getRepository(Rating_1.Rating);
        sentry_1.initializeSentry();
        const options = {
            host: '192.168.1.135',
            port: 6379,
            password: 'jJHBYlvrfbcuPrJsym7ZXYKCKPpAtoiDEYduKaYlDxJFvZ+QvtHxpIQM5N/+9kPEzuDWAvHA4vgSUu0q',
            db: 1
        };
        const schema = await type_graphql_1.buildSchema({
            resolvers: [__dirname + '/**/resolver.{ts,js}'],
            authChecker: authentication_1.authChecker,
            pubSub: new graphql_redis_subscriptions_1.RedisPubSub({
                publisher: new ioredis_1.default(options),
                subscriber: new ioredis_1.default(options)
            })
        });
        const server = new apollo_server_1.ApolloServer({
            schema,
            subscriptions: {
                path: "/subscriptions",
                //@ts-ignore
                onConnect: async (params) => {
                    if (!params || !params.token)
                        throw new Error("No auth token");
                    const tokenEntryResult = await exports.BeepORM.em.findOne(TokenEntry_1.TokenEntry, params.token, { populate: ['user'] });
                    if (tokenEntryResult)
                        return { user: tokenEntryResult.user, token: tokenEntryResult };
                }
            },
            context: async ({ req, connection }) => {
                if (!req) {
                    return connection?.context;
                }
                const token = req.get("Authorization")?.split(" ")[1];
                if (!token)
                    return;
                const tokenEntryResult = await exports.BeepORM.em.findOne(TokenEntry_1.TokenEntry, token, { populate: ['user'] });
                if (tokenEntryResult)
                    return { user: tokenEntryResult.user, token: tokenEntryResult };
            }
        });
        await server.listen(3001);
        console.log("🚕 Server ready and has started!");
    }
}
exports.default = BeepAPIServer;
