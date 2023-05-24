import { ClassType, Field, Int, ObjectType, ArgsType } from 'type-graphql';
import { IsNumber, Max, Min } from 'class-validator';

export function Paginated<T>(TItemClass: ClassType<T>) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items!: T[];

    @Field(() => Int)
    count!: number;
  }
  return PaginatedResponseClass;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(0)
  offset?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(1)
  @Max(50)
  show?: number;

  @Field(() => String, { nullable: true })
  query?: string;
}