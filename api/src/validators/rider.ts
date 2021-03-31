import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { QueueEntry } from '../entities/QueueEntry';

@InputType()
export default class GetBeepInput implements Partial<QueueEntry> {

  @Field()
  @IsString()
  @IsNotEmpty({ message: "Please specify an origin location"})
  public origin?: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "Please specify a destination location"})
  public destination?: string;

  @Field()
  @IsNumber()
  @Min(0)
  @Max(20)
  public groupSize?: number;

}
