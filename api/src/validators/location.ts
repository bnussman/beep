import { IsNumber } from 'class-validator';
import { Location } from '../entities/Location';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LocationInput implements Partial<Location> {

  @Field()
  @IsNumber()
  public latitude!: number;

  @Field()
  @IsNumber()
  public longitude!: number;

  @Field()
  @IsNumber()
  public altitude!: number;

  @Field()
  @IsNumber()
  public accuracy!: number;

  @Field()
  @IsNumber()
  public heading!: number;

  @Field()
  @IsNumber()
  public speed!: number;
}
