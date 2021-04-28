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
        const entry = await BeepORM.locationRepository.findOne({ user: ctx.user });

        if (!entry) {
            const e = new Location(location);

            pubSub.publish("Location" + ctx.user.id, e);

            BeepORM.locationRepository.persist(e);
        }
        else {
            wrap(entry).assign(location);

            pubSub.publish("Location" + ctx.user.id, entry);

            BeepORM.locationRepository.persist(entry);
        }

        await BeepORM.locationRepository.flush();

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
