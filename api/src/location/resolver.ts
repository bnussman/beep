import { Paginated } from '../users/resolver';
import { Arg, Args, Authorized, ObjectType, Query, Resolver } from 'type-graphql';
import { UserRole } from '../entities/User';
import PaginationArgs from '../args/Pagination';
import {BeepORM} from '../app';
import { Location } from '../entities/Location';

@ObjectType()
class LocationsResponse extends Paginated(Location) {}

@Resolver(Location)
export class LocationResolver {

    @Query(() => LocationsResponse)
    @Authorized(UserRole.ADMIN)
    public async getLocations(@Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<LocationsResponse> {
        const [locations, count] = await BeepORM.locationRepository.findAndCount(id ? { user: id } : {}, { limit: show, offset: offset });

        return {
            items: locations,
            count: count
        };
    }

}
