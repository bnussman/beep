import fieldsToRelations from '@banksnussman/graphql-fields-to-relations';
import { Arg, Args, Authorized, Ctx, Field, Info, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { deleteUser, isEduEmail, Upload, search } from './helpers';
import { LoadStrategy, QueryOrder, wrap } from '@mikro-orm/core';
import { PasswordType, User, UserRole } from '../entities/User';
import { Context } from '../utils/context';
import { GraphQLResolveInfo } from 'graphql';
import { Paginated, PaginationArgs } from '../utils/pagination';
import { sendNotification, sendNotificationsNew } from '../utils/notifications';
import { S3 } from 'aws-sdk';
import { getOlderObjectsToDelete, getAllObjects, getUserFromObjectKey, deleteObject, s3 } from '../utils/s3';
import { ChangePasswordInput, EditUserInput, NotificationArgs } from './args';
import { createVerifyEmailEntryAndSendEmail } from '../auth/helpers';
import { hash } from 'bcrypt';
import { VerifyEmail } from '../entities/VerifyEmail';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { setContext } from "@sentry/node";

@ObjectType()
class UsersPerDomain {
  @Field()
  domain!: string;

  @Field()
  count!: number;
}

@ObjectType()
class UsersWithBeeps {
  @Field()
  user!: User;

  @Field()
  beeps!: number;
}

@ObjectType()
class UsersWithRides {
  @Field()
  user!: User;

  @Field()
  rides!: number;
}

@ObjectType()
export class UsersWithBeepsResponse extends Paginated(UsersWithBeeps) {}

@ObjectType()
export class UsersWithRidesResponse extends Paginated(UsersWithRides) {}

@ObjectType()
export class UsersResponse extends Paginated(User) {}

@Resolver(User)
export class UserResolver {

  @Query(() => User)
  @Authorized('No Verification')
  public async getUser(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", { nullable: true }) id?: string): Promise<User> {
    const populate = fieldsToRelations(info) as Array<keyof User>;

    return await ctx.em.findOneOrFail(User, id || ctx.user.id, { populate, filters: ["inProgress"], strategy: LoadStrategy.SELECT_IN });
  }

  @Mutation(() => Boolean)
  @Authorized(UserRole.ADMIN)
  public async removeUser(@Ctx() ctx: Context, @Arg("id") id: string): Promise<boolean> {
    const user = ctx.em.getReference(User, id);

    if (!user) {
      throw new Error("User not found");
    }

    if (await deleteUser(user, ctx.em)) {
      return true;
    }

    return false;
  }

  @Mutation(() => User)
  @Authorized('No Verification Self')
  public async editUser(@Ctx() ctx: Context, @Arg("id", { nullable: true }) id: string, @Arg('data') data: EditUserInput, @PubSub() pubSub: PubSubEngine): Promise<User> {
    const user = !id ? ctx.user : await ctx.em.findOneOrFail(User, id);

    const oldEmail = ctx.user.email;

    if (user.isEmailVerified === false && data.isEmailVerified === true) {
      sendNotification(user.pushToken, "Account Verified ✅", "An admin has approved your account.");
    }

    Object.keys(data).forEach(key => {
      // @ts-expect-error dumb
      if (data[key] === undefined) {
        // @ts-expect-error dumb
        delete data[key];
      }
    });

    wrap(user).assign(data);

    if (id === undefined && data.email && (oldEmail !== data.email)) {
      wrap(ctx.user).assign({ isEmailVerified: false, isStudent: false });

      createVerifyEmailEntryAndSendEmail(ctx.user, ctx.em);
    }

    pubSub.publish("User" + user.id, user);

    await ctx.em.flush();

    return user;
  }

  @Mutation(() => Boolean)
  @Authorized('No Verification')
  public async changePassword(@Ctx() ctx: Context, @Arg('input') input: ChangePasswordInput): Promise<boolean> {
    ctx.user.password = await hash(input.password, 10);
    ctx.user.passwordType = PasswordType.BCRYPT;

    await ctx.em.flush();

    return true;
  }

  @Mutation(() => Boolean)
  public async verifyAccount(@Ctx() ctx: Context, @Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
    const verification = await ctx.em.findOneOrFail(VerifyEmail, id, { populate: ['user'] });

    if ((verification.time.getTime() + (18000 * 1000)) < Date.now()) {
      await ctx.em.removeAndFlush(verification);
      throw new Error("Your verification token has expired");
    }

    if (verification.email !== verification.user.email) {
      await ctx.em.removeAndFlush(verification);
      throw new Error("You tried to verify an email address that is not the same as your current email.");
    }

    const update = isEduEmail(verification.email) ? { isEmailVerified: true, isStudent: true } : { isEmailVerified: true };

    wrap(verification.user).assign(update);

    pubSub.publish("User" + verification.user.id, verification.user);

    await ctx.em.removeAndFlush(verification);

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized('No Verification')
  public async resendEmailVarification(@Ctx() ctx: Context): Promise<boolean> {
    await ctx.em.nativeDelete(VerifyEmail, { user: ctx.user });

    createVerifyEmailEntryAndSendEmail(ctx.user, ctx.em);

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
    if (ctx.user.role === UserRole.ADMIN) {
      throw new Error("Admin accounts cannot be deleted.");
    }

    return await deleteUser(ctx.user, ctx.em);
  }

  @Mutation(() => User)
  @Authorized('No Verification')
  public async addProfilePicture(@Ctx() ctx: Context, @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload, @PubSub() pubSub: PubSubEngine): Promise<User> {

    const extention = filename.substring(filename.lastIndexOf("."), filename.length);

    filename = ctx.user.id + "-" + Date.now() + extention;

    const uploadParams = {
      Body: createReadStream(),
      Key: "images/" + filename,
      Bucket: "beep",
      ACL: "public-read"
    };

    setContext("uploadParams", uploadParams);

    const result = await s3.upload(uploadParams).promise();

    if (ctx.user.photo) {
      const key = ctx.user.photo.split("https://beep.us-east-1.linodeobjects.com/")[1];

      deleteObject(key);
    }

    ctx.user.photo = result.Location;

    pubSub.publish("User" + ctx.user.id, ctx.user);

    await ctx.em.flush();

    return ctx.user;
  }

  @Query(() => UsersResponse)
  @Authorized(UserRole.ADMIN)
  public async getUsers(@Ctx() ctx: Context, @Args() { offset, show, query }: PaginationArgs): Promise<UsersResponse> {
    if (query) {
      return await search(ctx.em, offset, show, query);
    }

    const [users, count] = await ctx.em.findAndCount(
      User,
      {},
      {
        limit: show,
        offset: offset,
        orderBy: { created: QueryOrder.DESC_NULLS_LAST }
      }
    );

    return {
      items: users,
      count: count
    };
  }

  @Query(() => [UsersPerDomain])
  @Authorized(UserRole.ADMIN)
  public async getUsersPerDomain(@Ctx() ctx: Context): Promise<UsersPerDomain[]> {
    const connection = ctx.em.getConnection();

    const result: UsersPerDomain[] = await connection.execute(`
      select substring(email from '@(.*)$') as domain, count(*) as count
      from "user"
      group by domain
      order by count desc
    `);

    return result;
  }

  @Query(() => UsersWithBeepsResponse)
  @Authorized()
  public async getUsersWithBeeps(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs): Promise<UsersWithBeepsResponse> {
    const connection = ctx.em.getConnection();

    const count = await ctx.em.count(User);

    const result: (User & { beeps: number })[] = await connection.execute(`
      SELECT
        public. "user".*,
        count(beep.beeper_id) AS beeps
      FROM
        public. "user"
        LEFT JOIN beep ON ("user".id = beep.beeper_id)
      GROUP BY
        public.user.id
      ORDER BY
        beeps DESC
      OFFSET ${offset}
      LIMIT ${show};
    `);

    return {
      items: result.map(({ beeps, ...user }) => ({ user: new User(user), beeps })),
      count
    };
  }



  @Query(() => UsersWithRidesResponse)
  @Authorized()
  public async getUsersWithRides(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs): Promise<UsersWithRidesResponse> {
    const connection = ctx.em.getConnection();

    const count = await ctx.em.count(User);

    const result: (User & { rides: number })[] = await connection.execute(`
      SELECT
        public. "user".*,
        count(beep.rider_id) AS rides
      FROM
        public. "user"
        LEFT JOIN beep ON ("user".id = beep.rider_id)
      GROUP BY
        public.user.id
      ORDER BY
        rides DESC
      OFFSET ${offset}
      LIMIT ${show};
    `);

    return {
      items: result.map(({ rides, ...user }) => ({ user: new User(user), rides })),
      count
    };
  }

  @Mutation(() => Number)
  @Authorized(UserRole.ADMIN)
  public async sendNotifications(@Ctx() ctx: Context, @Args() { title, match, body }: NotificationArgs): Promise<number> {
    const users = await ctx.em.find(User, match ? {
      email: { $like: match }
    } : {});

    const tokens = users.map(user => user.pushToken).filter(token => token) as string[];

    sendNotificationsNew(tokens, title, body);

    return tokens.length;
  }

  @Mutation(() => Boolean)
  @Authorized(UserRole.ADMIN)
  public async sendNotification(@Ctx() ctx: Context, @Arg('title') title: string, @Arg('body') body: string, @Arg('id') id: string): Promise<boolean> {
    const user = await ctx.em.findOneOrFail(User, id);

    sendNotification(user.pushToken, title, body);

    return true;
  }

  @Mutation(() => Number)
  @Authorized(UserRole.ADMIN)
  public async cleanObjectStorageBucket(@Ctx() { em }: Context): Promise<number> {
    const objects = await getAllObjects({
      Bucket: 'beep',
      Prefix: 'images/',
    });

    const objectsToDelete: S3.ObjectList = [];

    for (const object of objects) {
      const userId = getUserFromObjectKey(object.Key);
      
      const user = await em.findOne(User, { id: userId });

      if (user === null) {
        objectsToDelete.push(object);
      }

      const objectsWithSameUser = objects.filter(object => object.Key?.startsWith(`images/${userId}`));

      if (objectsWithSameUser.length > 1) {
        objectsToDelete.concat(getOlderObjectsToDelete(objectsWithSameUser));
      }
    }

    for (const object of objectsToDelete) {
      if (object.Key === undefined) {
        throw new Error("Key is undefined when trying to delete an old object");
      }
      deleteObject(object.Key);
    }

    return objectsToDelete.length;
  }

  @Subscription(() => User, {
    topics: ({ context }) => "User" + context.user.id,
  })
  @Authorized('No Verification')
  public getUserUpdates(@Ctx() ctx: Context, @Root() user: User): User {
    return user;
  }
}
