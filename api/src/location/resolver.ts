import { Paginated } from '../utils/paginated';
import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { UserRole } from '../entities/User';
import PaginationArgs from '../args/Pagination';
import {BeepORM} from '../app';
import { Location } from '../entities/Location';
import { Context } from '../utils/context';
import { LocationInput } from '../validators/location';
import {QueryOrder} from '@mikro-orm/core';

@ObjectType()
class LocationsResponse extends Paginated(Location) {}

@Resolver(Location)
export class LocationResolver {

    @Query(() => LocationsResponse)
    @Authorized(UserRole.ADMIN)
    public async getLocations(@Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<LocationsResponse> {
        const [locations, count] = await BeepORM.locationRepository.findAndCount(id ? { user: id } : {}, { orderBy: { timestamp: QueryOrder.DESC }, offset: offset, limit: show, populate: ["user"] });

        return {
            items: locations,
            count: count
        };
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async insertLocation(@Ctx() ctx: Context, @Arg('location') location: LocationInput, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const l = new Location(location);

        pubSub.publish("Location" + ctx.user.id, l);

        l.user = ctx.user;

        BeepORM.locationRepository.persist(l);

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
