import PaginationArgs from '../args/Pagination';
import EditUserValidator from '../validators/user/EditUser';
import fieldsToRelations from 'graphql-fields-to-relations';
import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { deleteUser } from '../account/helpers';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User';
import { Context } from '../utils/context';
import { GraphQLResolveInfo } from 'graphql';
import { Paginated } from '../utils/paginated';
import { search } from './helpers';
import { sendNotification, sendNotificationsNew } from '../utils/notifications';
import { S3 } from 'aws-sdk';
import { getOlderObjectsToDelete, getAllObjects, getUserFromObjectKey, deleteObject } from '../utils/s3';

@ObjectType()
export class UsersResponse extends Paginated(User) {}

@Resolver(User)
export class UserResolver {

  @Query(() => User)
  @Authorized('No Verification')
  public async getUser(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", { nullable: true }) id?: string): Promise<User> {
    const populate = fieldsToRelations(info, { excludeFields: ['location'] });

    return await ctx.em.findOneOrFail(User, id || ctx.user.id, { populate });
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
  @Authorized(UserRole.ADMIN)
  public async editUser(@Ctx() ctx: Context, @Arg("id") id: string, @Arg('data') data: EditUserValidator, @PubSub() pubSub: PubSubEngine): Promise<User> {
    const user = await ctx.em.findOneOrFail(User, id);

    if (user.isEmailVerified === false && data.isEmailVerified === true) {
      sendNotification(user.pushToken, "Account Verified", "An admin has approved your account.");
    }

    Object.keys(data).forEach(key => {
      // @ts-expect-error dumb
      if (data[key] === undefined) {
        // @ts-expect-error dumb
        delete data[key];
      }
    });

    wrap(user).assign(data);

    pubSub.publish("User" + id, user);

    await ctx.em.flush();

    return user;
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

  @Mutation(() => Number)
  @Authorized(UserRole.ADMIN)
  public async sendNotifications(@Ctx() ctx: Context, @Arg('title') title: string, @Arg('body') body: string, @Arg('match', { nullable: true }) match?: string): Promise<number> {
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
