import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { deleteUser } from '../account/helpers';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User';
import PaginationArgs from '../args/Pagination';
import EditUserValidator from '../validators/user/EditUser';
import { Context } from '../utils/context';
import { GraphQLResolveInfo } from 'graphql';
import fieldsToRelations from 'graphql-fields-to-relations';
import { Paginated } from '../utils/paginated';
import { search } from './helpers';
import { sendNotification } from '../utils/notifications';

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

    if (await deleteUser(user)) {
      return true;
    }

    return false;
  }

  @Mutation(() => User)
  @Authorized(UserRole.ADMIN)
  public async editUser(@Ctx() ctx: Context, @Arg("id") id: string, @Arg('data') data: EditUserValidator, @PubSub() pubSub: PubSubEngine): Promise<User> {
    const user = await ctx.em.findOneOrFail(User, id);

    wrap(user).assign(data);

    pubSub.publish("User" + id, user);

    await ctx.em.flush();

    if (user.isEmailVerified !== data.isEmailVerified) {
      sendNotification(user.pushToken, "Account Verified", "An admin has approved your account.");
    }

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

  @Subscription(() => User, {
    topics: ({ context }) => "User" + context.user.id,
  })
  @Authorized('No Verification')
  public getUserUpdates(@Ctx() ctx: Context, @Root() user: User): User {
    return user;
  }
}
