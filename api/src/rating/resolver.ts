import { BeepORM } from '../app';
import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { RatingInput } from '../validators/rating';
import { Beep } from '../entities/Beep';
import { Paginated } from '../utils/paginated';
import { Rating } from '../entities/Rating';
import PaginationArgs from '../args/Pagination';
import { QueryOrder } from '@mikro-orm/core';
import fieldsToRelations from 'graphql-fields-to-relations';
import { GraphQLResolveInfo } from 'graphql';
import { UserRole } from '../entities/User';
import {sendNotification} from '../utils/notifications';

@ObjectType()
class RatingsResponse extends Paginated(Rating) {}

@Resolver(Rating)
export class RatingResolver {

    @Mutation(() => Boolean)
    @Authorized()
    public async rateUser(@Ctx() ctx: Context, @Arg('input') input: RatingInput): Promise<boolean> {
        const user = await BeepORM.userRepository.findOneOrFail(input.userId);

        const beep = input.beepId ? BeepORM.em.getReference(Beep, input.beepId) : undefined;
        
        const rating = new Rating(ctx.user, user, input.stars, input.message, beep);

        if (!user.rating) {
            user.rating = input.stars;
        }
        else {
            const numberOfRatings = await BeepORM.ratingRepository.count({ rated: input.userId });  
            
            user.rating = ((user.rating * numberOfRatings) + input.stars) / (numberOfRatings + 1);
        }

        user.ratings.add(rating);

        try { 
            await BeepORM.userRepository.persistAndFlush(user);
        }
        catch (e) {
            console.log(e)
        }

        sendNotification(user.pushToken, "You got rated!", `${ctx.user.name()} rated you ${input.stars} stars!`);

        return true;
    }

    @Query(() => RatingsResponse)
    @Authorized()
    public async getRatings(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string, @Arg('me', { nullable: true }) me?: boolean): Promise<RatingsResponse> {
        let filter = {};

        if (me) {
            filter = {
                rated: id || ctx.user.id
            };
        }
        else if(!me) {
            filter = {
                rater: id || ctx.user.id
            };
        }

        const [ratings, count] = await BeepORM.ratingRepository.findAndCount(filter, {
            orderBy: { timestamp: QueryOrder.DESC },
            populate: ['rater', 'rated'],
            offset: offset,
            limit: show
        });

        return {
            items: ratings,
            count: count
        };
    }

    @Query(() => Rating)
    @Authorized()
    public async getRating(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Rating> {
        return await BeepORM.ratingRepository.findOneOrFail(id, fieldsToRelations(info));
    }

    @Mutation(() => Boolean)
    @Authorized(UserRole.ADMIN)
    public async deleteRating(@Arg('id') id: string): Promise<boolean> {
        const rating = BeepORM.ratingRepository.getReference(id);

        await BeepORM.ratingRepository.removeAndFlush(rating);

        return true;
    }
}
