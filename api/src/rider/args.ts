import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Point } from '../location/resolver';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
export class GetBeepInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: "Please specify an origin location" })
  public origin?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: "Please specify a destination location" })
  public destination?: string;

  @Field(() => Number)
  @IsNumber()
  @Min(1)
  @Max(30, { message: "Your group is too big" })
  public groupSize?: number;
}

@ArgsType()
export class GetBeepersArgs implements Point {
  @Field(() => Number)
  @IsNumber()
  longitude!: number;

  @Field(() => Number)
  @IsNumber()
  latitude!: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(30)
  radius: number = 10;
}
