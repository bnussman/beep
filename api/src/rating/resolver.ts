import { BeepORM } from '../app';
import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { RatingInput } from '../validators/rating';
import { Beep } from '../entities/Beep';
import {Paginated} from '../utils/paginated';
import {Rating} from '../entities/Rating';
import PaginationArgs from '../args/Pagination';

@ObjectType()
class RatingsResponse extends Paginated(Rating) {}

@Resolver(Rating)
export class RatingResolver {

    @Mutation(() => Boolean)
    @Authorized()
    public async rateUser(@Ctx() ctx: Context, @Arg('input') input: RatingInput): Promise<boolean> {
        const user = await BeepORM.userRepository.findOneOrFail(input.userId, true);

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
        
        await BeepORM.userRepository.persistAndFlush(user);

        return true;
    }

    @Query(() => RatingsResponse)
    @Authorized()
    public async getRatings(@Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<RatingsResponse> {
        const [ratings, count] = await BeepORM.em.findAndCount(Rating, id ? { rated: id } : {}, { limit: show, offset: offset, populate: ['rater', 'rated'] });

        return {
            items: ratings,
            count: count
        };
    }
}
