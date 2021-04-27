import {wrap} from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import {BeepORM} from '../app';
import { Location } from '../entities/Location';
import { Context } from '../utils/context';
import { LocationInput } from '../validators/location';

@Resolver(Location)
export class LocationResolver {

    @Mutation(() => Boolean)
    @Authorized()
    public async insertLocation(@Ctx() ctx: Context, @Arg('location') location: LocationInput, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        await BeepORM.userRepository.populate(ctx.user, 'location');

        console.log("User in insertLocation", ctx.user);

        if (!ctx.user.location) {
            console.log("Creating new location entry");
            ctx.user.location = new Location(location);
        }
        else {
            console.log("Updating exisiting location tentry");
            wrap(ctx.user.location).assign(location);
        }

        console.log("Sending", ctx.user.location, "over the websocket");
        pubSub.publish("Location" + ctx.user.id, ctx.user.location);

        BeepORM.userRepository.persistAndFlush(ctx.user);

        return true;
    }

    @Subscription(() => Location, {
        nullable: true,
        topics: ({ args }) => "Location" + args.topic,
    })
    public getLocationUpdates(@Arg("topic") topic: string, @Root() entry: Location): Location {
        return entry;
    }
}
