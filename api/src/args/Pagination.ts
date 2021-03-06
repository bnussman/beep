import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class PaginationArgs {

  @Field(type => Int, { nullable: true })
  @Min(0)
  offset?: number;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(50)
  show?: number;

  @Field(type => String, { nullable: true })
  query?: string;
}
