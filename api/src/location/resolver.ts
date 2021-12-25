import { IsLatitude, IsLongitude } from 'class-validator';
import { User } from '../entities/User';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { LocationInput } from '../validators/location';

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

  @Mutation(() => Boolean)
  @Authorized('self')
  public async setLocation(
    @Ctx() ctx: Context,
    @Arg('location') location: LocationInput,
    @PubSub() pubSub: PubSubEngine,
    @Arg('id', { nullable: true }) id?: string
  ): Promise<boolean> {
    if (id) {
      const user = await ctx.em.findOneOrFail(User, id);

      user.location = new Point(location.latitude, location.longitude);
      console.log(user, location);
      await ctx.em.persistAndFlush(user);

      return true;
    }

    ctx.user.location = new Point(location.latitude, location.longitude);

    pubSub.publish("Location" + ctx.user.id, location);

    await ctx.em.persistAndFlush(ctx.user);

    return true;
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
