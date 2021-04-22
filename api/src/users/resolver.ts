import { deleteUser } from '../account/helpers';
import { BeepORM } from '../app';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import PaginationArgs from '../args/Pagination';
import { Beep } from '../entities/Beep';
import { QueueEntry } from '../entities/QueueEntry';
import EditUserValidator from '../validators/user/EditUser';
import { Context } from '../utils/context';
import { GraphQLResolveInfo } from 'graphql';
import fieldsToRelations from 'graphql-fields-to-relations';
import { Paginated } from '../utils/paginated';

@ObjectType()
class UsersResponse extends Paginated(User) {}

@ObjectType()
class RideHistoryResponse extends Paginated(Beep) {}

@ObjectType()
class BeepHistoryResponse extends Paginated(Beep) {}

@Resolver(User)
export class UserResolver {

    @Query(() => User)
    @Authorized()
    public async getUser(@Ctx() ctx: Context, @Arg("id", { nullable: true }) id?: string): Promise<User> {
        const user = await BeepORM.userRepository.findOne(id || ctx.user.id, false);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    @Mutation(() => Boolean)
    @Authorized(UserRole.ADMIN)
    public async removeUser(@Arg("id") id: string): Promise<boolean> {
        const user = BeepORM.em.getReference(User, id);

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
    public async editUser(@Arg("id") id: string, @Arg('data') data: EditUserValidator, @PubSub() pubSub: PubSubEngine): Promise<User> {
        const user = await BeepORM.userRepository.findOne(id);

        if (!user) {
            throw new Error("User not found");
        }

        wrap(user).assign(data);

        pubSub.publish("User" + id, user);

        await BeepORM.userRepository.persistAndFlush(user);

        return user;
    }

    @Query(() => UsersResponse)
    @Authorized(UserRole.ADMIN)
    public async getUsers(@Args() { offset, show }: PaginationArgs): Promise<UsersResponse> {
        const [users, count] = await BeepORM.em.findAndCount(User, {}, { limit: show, offset: offset });

        return {
            items: users,
            count: count
        };
    }

    @Query(() => RideHistoryResponse)
    @Authorized()
    public async getRideHistory(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg("id", { nullable: true }) id?: string): Promise<RideHistoryResponse> {
        const [rides, count] = await BeepORM.beepRepository.findAndCount({ rider: id || ctx.user }, { orderBy: { doneTime: QueryOrder.DESC }, populate: ['beeper', 'rider'], offset: offset, limit: show });

        return {
            items: rides,
            count: count
        };
    }

    @Query(() => BeepHistoryResponse)
    @Authorized()
    public async getBeepHistory(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg("id", { nullable: true }) id?: string): Promise<BeepHistoryResponse>  {
        const [beeps, count] = await BeepORM.beepRepository.findAndCount({ beeper: id || ctx.user }, { orderBy: { doneTime: QueryOrder.DESC }, populate: ['beeper', 'rider'], offset: offset, limit: show });

        return {
            items: beeps,
            count: count
        };
    }

    @Query(() => [QueueEntry])
    @Authorized()
    public async getQueue(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", { nullable: true }) id?: string): Promise<QueueEntry[]> {
        const relationPaths = fieldsToRelations(info);
        const r = await BeepORM.queueEntryRepository.find({ beeper: id || ctx.user.id }, { orderBy: { timeEnteredQueue: QueryOrder.ASC }, populate: relationPaths, refresh: true });

        return r;
    }

    @Subscription(() => User, {
        topics: ({ args }) => "User" + args.topic,
    })
    public getUserUpdates(@Arg("topic") topic: string, @Root() user: User): User {
        return user;
    }
}
