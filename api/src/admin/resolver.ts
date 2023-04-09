import Redis from "ioredis";
import { UserRole } from "../entities/User";
import { REDIS_HOST, REDIS_PASSWROD } from "../utils/constants";
import { Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Venmo } from "@banksnussman/venmo";

@Resolver()
export class AdminResolver {
  @Query(() => [String])
  @Authorized(UserRole.ADMIN)
  public async getRedisChannels(): Promise<string[]> {
    const redis = new Redis({
      host: REDIS_HOST,
      password: REDIS_PASSWROD,
      port: 6379,
    });

    const channels = await redis.pubsub("CHANNELS") as string[];

    return channels;
  }

  @Mutation(() => Number)
  @Authorized(UserRole.ADMIN)
  public async makePayment(): Promise<number> {
    const venmo = new Venmo({
      username: process.env.VENMO_USERNAME ?? "",
      password: process.env.VENMO_PASSWORD ?? "",
      bankAccountNumber: process.env.VENMO_BANK_ACCOUNT_NUMBER ?? "",
    });

    const balance = await venmo.pay({
      username: "Ian-Murphy-35",
      amount: 0.02,
      note: "OMG!"
    })

    return balance;
  }
}