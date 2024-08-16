import { IsLatitude, IsLongitude } from 'class-validator';
import { User, UserRole } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Field, Mutation, ObjectType, Resolver, Root, Subscription } from 'type-graphql';
import type { Context } from '../utils/context';
import { BeeperLocationArgs, LocationInput } from './args';
import { AnonymousBeeper } from '../beeper/resolver';
import { getDistance } from '../utils/dist';
import { sha256 } from 'js-sha256';
import { pubSub } from '../utils/pubsub';
import { GraphQLError } from 'graphql';

@ObjectType()
export class Point {
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  @Field(() => Number)
  @IsLongitude()
  public longitude: number;

  @Field(() => Number)
  @IsLatitude()
  public latitude: number;
}

@Resolver(Point)
export class LocationResolver {

  @Mutation(() => User)
  @Authorized()
  public async setLocation(
    @Ctx() ctx: Context,
    @Arg('location', () => LocationInput) location: LocationInput,
    @Arg('id', () => String, { nullable: true }) id?: string
  ): Promise<User> {
    if (id) {
      if (ctx.user.role !== UserRole.ADMIN) {
        throw new GraphQLError("You can't update another user's location without being an admin.");
      }

      const user = await ctx.em.findOneOrFail(User, id);

      user.location = new Point(location.latitude, location.longitude);

      pubSub.publish("location", id, location);
      pubSub.publish("beeperLocation", { id, ...location });

      await ctx.em.persistAndFlush(user);

      return user;
    }

    ctx.user.location = new Point(location.latitude, location.longitude);

    pubSub.publish("location", ctx.user.id, location);
    pubSub.publish("beeperLocation", { id: ctx.user.id, ...location });

    await ctx.em.persistAndFlush(ctx.user);

    return ctx.user;
  }

  @Subscription(() => Point, {
    nullable: true,
    topics: "location",
    topicId: ({ args }) => args.id,
  })
  public getLocationUpdates(@Arg("id", () => String) id: string, @Root() entry: LocationInput): Point {
    return {
      latitude: entry.latitude,
      longitude: entry.longitude,
    };
  }

  @Subscription(() => AnonymousBeeper, {
    topics: "beeperLocation",
    filter: ({ args, payload }) => {
      if (args.radius === 0) {
        return true;
      }
      return getDistance(args.latitude, args.longitude, payload.latitude, payload.longitude) < args.radius;
    },
  })
  public getBeeperLocationUpdates(
    @Ctx() ctx: Context,
    @Args(() => BeeperLocationArgs) args: BeeperLocationArgs,
    @Root() data: AnonymousBeeper,
    @Arg('anonymize', () => Boolean, { nullable: true, defaultValue: true }) anonymize: boolean
  ): AnonymousBeeper {
    if (anonymize) {
      return { id: sha256(data.id).substring(0, 9), latitude: data.latitude, longitude: data.longitude };
    }
    if (ctx.user.role !== UserRole.ADMIN) {
      throw new GraphQLError("You must be an admin to see un-anonamized beeper locations");
    }
    return data;
  }
}
