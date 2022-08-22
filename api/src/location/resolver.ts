import { IsLatitude, IsLongitude } from 'class-validator';
import { User, UserRole } from '../entities/User';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { LocationInput } from '../validators/location';
import { AuthenticationError } from 'apollo-server-core';

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

      await ctx.em.persistAndFlush(user);

      return user;
    }

    ctx.user.location = new Point(location.latitude, location.longitude);

    pubSub.publish("Location" + ctx.user.id, location);

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
}
