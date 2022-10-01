import { IsLatitude, IsLongitude } from 'class-validator';
import { User, UserRole } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { BeeperLocationArgs, LocationInput } from './args';
import { AuthenticationError } from 'apollo-server-core';
import { AnonymousBeeper } from '../beeper/resolver';
import { getDistance } from '../utils/dist';
import { sha256 } from 'js-sha256';

@ObjectType()
export class Point {
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  @Field()
  @IsLongitude()
  public longitude: number;

  @Field()
  @IsLatitude()
  public latitude: number;
}

@Resolver(Point)
export class LocationResolver {

  @Mutation(() => User)
  @Authorized()
  public async setLocation(
    @Ctx() ctx: Context,
    @Arg('location') location: LocationInput,
    @PubSub() pubSub: PubSubEngine,
    @Arg('id', { nullable: true }) id?: string
  ): Promise<User> {
    if (id) {
      // If an id is passed, that probably means someone is change another user's location.
      // We should make sure only admins do this.

      if (ctx.user.role !== UserRole.ADMIN) {
        throw new AuthenticationError("You can't update another user's location without being an admin.");
      }

      const user = await ctx.em.findOneOrFail(User, id);

      user.location = new Point(location.latitude, location.longitude);

      pubSub.publish("Location" + id, location);
      pubSub.publish("Beepers", { id: sha256(id).substring(0, 9), ...location });

      await ctx.em.persistAndFlush(user);

      return user;
    }

    ctx.user.location = new Point(location.latitude, location.longitude);

    pubSub.publish("Location" + ctx.user.id, location);
    pubSub.publish("Beepers", { id: sha256(ctx.user.id).substring(0, 9), ...location });

    await ctx.em.persistAndFlush(ctx.user);

    return ctx.user;
  }

  @Subscription(() => Point, {
    nullable: true,
    topics: ({ args }) => "Location" + args.id,
  })
  public getLocationUpdates(@Arg("id") id: string, @Root() entry: LocationInput): Point {
    return {
      latitude: entry.latitude,
      longitude: entry.longitude,
    };
  }

  @Subscription(() => AnonymousBeeper, {
    topics: "Beepers",
    filter: ({ args, payload }) => {
      if (args.radius === 0) {
        return true;
      }
      return getDistance(args.latitude, args.longitude, payload.latitude, payload.longitude) < args.radius;
    },
  })
  public getBeeperLocationUpdates(@Args() args: BeeperLocationArgs, @Root() location: AnonymousBeeper): AnonymousBeeper {
    return location;
  }
}
