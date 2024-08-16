import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Rating } from '../entities/Rating';

@InputType()
export class RatingInput implements Partial<Rating> {
  @Field(() => String)
  @IsString()
  public userId!: string;

  @Field(() => Number)
  @IsNumber()
  @Max(5)
  @Min(1)
  public stars!: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public message?: string;

  @Field(() => String)
  @IsString()
  public beepId!: string;
}
