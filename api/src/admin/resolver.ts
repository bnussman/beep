import Redis from "ioredis";
import { User, UserRole } from "../entities/User";
import { REDIS_HOST, REDIS_PASSWROD } from "../utils/constants";
import { Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Context } from "../utils/context";
import { transporter } from "src/utils/mailer";
import * as Sentry from '@sentry/bun';

@ObjectType()
class UserWithBeeps extends User {
  @Field()
  beeps!: number;
}


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

  @Query(() => [UserWithBeeps])
  @Authorized(UserRole.ADMIN)
  public async getUsersWithDuplicateEmails(@Ctx() ctx: Context): Promise<UserWithBeeps[]> {
    const usersWithDuplicateEmails = await ctx.em.execute(`
      SELECT "user".*, COUNT("beep".id) AS beeps
      FROM "user"
      INNER JOIN "beep" ON "beep".beeper_id = "user".id OR "beep".rider_id = "user".id
      WHERE UPPER("user".email) IN
      (SELECT UPPER("user".email) FROM "user" GROUP BY UPPER("user".email) HAVING COUNT(*) > 1)
      GROUP BY "user".id
      ORDER BY "user".email
   `);

    return usersWithDuplicateEmails as UserWithBeeps[];
  }

  @Mutation(() => [UserWithBeeps])
  @Authorized(UserRole.ADMIN)
  public async sendDuplicateEmailNotification(@Ctx() ctx: Context): Promise<UserWithBeeps[]> {
    const usersWithDuplicateEmails = await ctx.em.execute(`
      SELECT "user".*, COUNT("beep".id) AS beeps
      FROM "user"
      INNER JOIN "beep" ON "beep".beeper_id = "user".id OR "beep".rider_id = "user".id
      WHERE UPPER("user".email) IN
      (SELECT UPPER("user".email) FROM "user" GROUP BY UPPER("user".email) HAVING COUNT(*) > 1)
      GROUP BY "user".id
      ORDER BY "user".email
   `) as UserWithBeeps[];

    const emailUserMap = new Map<string, UserWithBeeps[]>();

    for (const user of usersWithDuplicateEmails) {
      const email = user.email.toLowerCase();

      if (emailUserMap.has(email)) {
        const existing = emailUserMap.get(email)!;
        emailUserMap.set(email, [...existing, user]);
      } else {
        emailUserMap.set(email, [user]);
      }
    }

    for (const [email, users] of emailUserMap) {
      const indexOfUserToKeep = getUserWithMostBeeps(users);
 
      const mailOptions = {
        from: 'Beep App <banks@ridebeep.app>',
        to: email,
        subject: 'Beep App account will be deleted',
        html: `Hello,
               <br>
               <br>
               <p>
                 We've detected that you are signed up for the Beep App with <b>${users.length}</b> accounts.
                 This likely happened because you signed up many times with the email address <b>${email}</b> using different letter casing.
               </p>
               <p>
                 It was never our intention for users to be able to create many accounts using the same email with different
                 variations of letter casing. We want users to have only <b>one</b> account on our platform.
               </p>
               <p>
                 Because you have <b>${users.length}</b> accounts, <b>we will delete all but one of your accounts on April 30th 2024.</b>
                 We will retain the account with the most number of total beeps.
               </p>
               <p>
                 If you want explict control of which account is kept,
                 we recommend you login to the accounts you don't use and delete them yourself or delete them at https://ridebeep.app/account/delete
               </p>
               <p>
                 This will ensure you only have one account and your account won't be at risk of deletion.
               </p>
               <br>
               <h3>
                 Your accounts are
               </h3>
              ${users.map((user, index) => `<p>Username: ${user.username} | Email: ${user.email} ${index === indexOfUserToKeep ? '| Currently, this is the user that will be kept.' : ''}</p>`).join("\n")}
               <br>
               <p>We are sorry for any inconvenience this may cause you.</p>
               <br>
               -Banks Nussman
              `
      };

      transporter.sendMail(mailOptions, (error: Error | null) => {
        if (error) {
          console.error(error);
          Sentry.captureException(error);
        }
      });
    }

    return usersWithDuplicateEmails;
  }
}

function getUserWithMostBeeps(users: UserWithBeeps[]) {
  let index = 0;
  let mostBeepsCount = users[0].beeps;

  for (let i = 0; i < users.length; i++) {
    if (users[i].beeps > mostBeepsCount) {
     mostBeepsCount = users[i] .beeps;
     index = i;
    }
  }

  return index;
}