import { BeepORM } from '../app';
import { Beep } from '../entities/Beep';
import { QueryOrder } from '@mikro-orm/core';
import { Arg, Args, Authorized, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import PaginationArgs from '../args/Pagination';
import {Paginated} from '../users/resolver';
import {UserRole} from '../entities/User';

// we need to create a temporary class for the abstract, generic class "instance"
@ObjectType()
class BeepsResponse extends Paginated(Beep) {
  // you can add more fields here if you need
}

@Resolver(Beep)
export class BeepResolver {
   
    @Query(() => BeepsResponse)
    @Authorized(UserRole.ADMIN)
    public async getBeeps(@Args() { offset, show }: PaginationArgs): Promise<BeepsResponse> {
        const [beeps, count] = await BeepORM.beepRepository.findAndCount({}, { orderBy: { doneTime: QueryOrder.DESC }, limit: show, offset: offset, populate: ['beeper', 'rider'] });

        return {
            items: beeps,
            count: count
        };
    }

    @Query(() => Beep)
    @Authorized(UserRole.ADMIN)
    public async getBeep(@Arg('id') id: string): Promise<Beep> {
        const beep = await BeepORM.beepRepository.findOne(id);

        if (!beep) {
            throw new Error("This beep entry does not exist");
        }

        return beep;
    }

    @Mutation(() => Boolean)
    @Authorized(UserRole.ADMIN)
    public async deleteBeep(@Arg('id') id: string): Promise<boolean> {
        const beep = BeepORM.beepRepository.getReference(id);

        await BeepORM.beepRepository.removeAndFlush(beep);

        return true;
    }
}
