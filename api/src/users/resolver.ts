import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { deleteUser } from '../account/helpers';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User';
import PaginationArgs from '../args/Pagination';
import { QueueEntry } from '../entities/QueueEntry';
import EditUserValidator from '../validators/user/EditUser';
import { Context } from '../utils/context';
import { GraphQLResolveInfo } from 'graphql';
import fieldsToRelations from 'graphql-fields-to-relations';
import { Paginated } from '../utils/paginated';
import { search } from './helpers';

@ObjectType()
export class UsersResponse extends Paginated(User) {}

@Resolver(User)
export class UserResolver {

  @Query(() => User)
  @Authorized()
  public async getUser(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", { nullable: true }) id?: string): Promise<User> {
    const populate = fieldsToRelations(info).filter((key: string) => key !== 'location');

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

    return user;
  }

  @Query(() => UsersResponse)
  @Authorized(UserRole.ADMIN)
  public async getUsers(@Ctx() ctx: Context, @Args() { offset, show, query }: PaginationArgs): Promise<UsersResponse> {
    if (query) {
      return await search(ctx.em, offset, show, query);
    }

    const [users, count] = await ctx.em.findAndCount(User, {}, { limit: show, offset: offset });

    return {
      items: users,
      count: count
    };
  }

  @Query(() => [QueueEntry])
  @Authorized('self')
  public async getQueue(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", { nullable: true }) id?: string): Promise<QueueEntry[]> {
    const populate = fieldsToRelations(info);

    return await ctx.em.find(QueueEntry, { beeper: id || ctx.user.id }, { orderBy: { start: QueryOrder.ASC }, populate });
  }

  @Subscription(() => User, {
    topics: ({ args }) => "User" + args.id,
  })
  @Authorized('self')
  public getUserUpdates(@Arg("id") id: string, @Root() user: User): User {
    return user;
  }
}
