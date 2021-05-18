import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Rating } from '../entities/Rating';

@InputType()
export class RatingInput implements Partial<Rating> {

  @Field()
  @IsString()
  public userId!: string;

  @Field()
  @IsNumber()
  @Max(5)
  @Min(1)
  public stars!: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public message?: string;

  @Field()
  @IsString()
  public beepId!: string;
}
