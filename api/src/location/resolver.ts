import { wrap } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import {BeepORM} from '../app';
import { Location } from '../entities/Location';
import { Context } from '../utils/context';
import { LocationInput } from '../validators/location';

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
        try {
            const entry = await BeepORM.locationRepository.findOne({ user: ctx.user.id }, { populate: false, refresh: true });

            if (!entry) {
                const e = new Location({ ...location, user: ctx.user });

                BeepORM.locationRepository.persist(e);
            }
            else {
                wrap(entry).assign(location);

                BeepORM.locationRepository.persist(entry);
            }

            pubSub.publish("Location" + ctx.user.id, ctx.user.location);

            await BeepORM.locationRepository.flush();

        }
        catch (error) {
            console.log(error);
        }
        /*
        try {
            await BeepORM.userRepository.populate(ctx.user, ['location']);

            if (ctx.user.location) {
                wrap(ctx.user.location).assign(location);
            }
            else {
                ctx.user.location = new Location({ ...location, user: ctx.user });
            }

            pubSub.publish("Location" + ctx.user.id, new Location({ ...location, user: ctx.user }));

            await BeepORM.userRepository.persistAndFlush(ctx.user);
        }
        catch (error) {
            console.log(error);
        }
         */

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
