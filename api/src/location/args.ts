import { IsNumber, IsOptional } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
export class LocationInput {
  @Field(() => Number)
  @IsNumber()
  public latitude!: number;

  @Field(() => Number)
  @IsNumber()
  public longitude!: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  public altitude!: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  public accuracy?: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  public altitudeAccuracy?: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  public heading!: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  public speed!: number;
}

@ArgsType()
export class BeeperLocationArgs {
  @Field(() => Number)
  @IsNumber()
  public latitude!: number;

  @Field(() => Number)
  @IsNumber()
  public longitude!: number;

  @Field(() => Number)
  @IsNumber()
  public radius!: number;
}
