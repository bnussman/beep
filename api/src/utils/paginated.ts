import { ClassType, Field, Int, ObjectType } from 'type-graphql';

export function Paginated<T>(TItemClass: ClassType<T>) {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field(() => [TItemClass])
        items!: T[];

        @Field(() => Int)
        count!: number;
    }
    return PaginatedResponseClass;
}