import { Location } from '../entities/Location';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { LocationInput } from '../validators/location';
import {wrap} from '@mikro-orm/core';

@ObjectType()
class LocationData {
    @Field()
    public longitude!: number;

    @Field()
    public latitude!: number;
}

@Resolver(Location)
export class LocationResolver {

    @Mutation(() => Boolean)
    @Authorized()
    public async insertLocation(@Ctx() ctx: Context, @Arg('location') location: LocationInput, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const entry = await ctx.em.findOne(Location, { user: ctx.user.id }, { populate: false, refresh: true });

        if (!entry) {
            const e = new Location({ ...location, user: ctx.user });

            ctx.em.persist(e);
        }
        else {
            wrap(entry).assign(location);

            ctx.em.persist(entry);
        }

        pubSub.publish("Location" + ctx.user.id, location);

        await ctx.em.flush();

        return true;
    }

    @Subscription(() => LocationData, {
        nullable: true,
        topics: ({ args }) => "Location" + args.topic,
    })
    public getLocationUpdates(@Arg("topic") topic: string, @Root() entry: Location): LocationData {
        return entry;
    }
}
