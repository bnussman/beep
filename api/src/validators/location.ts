import { IsNumber, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LocationInput {

  @Field()
  @IsNumber()
  public latitude!: number;

  @Field()
  @IsNumber()
  public longitude!: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  public altitude!: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  public accuracy?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  public altitudeAccuracy?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  public heading!: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  public speed!: number;
}
