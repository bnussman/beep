import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { QueueEntry } from '../entities/QueueEntry';

@InputType()
export default class GetBeepInput implements Partial<QueueEntry> {

  @Field()
  @IsString()
  public origin?: string;

  @Field()
  @IsString()
  public destination?: string;

  @Field()
  @IsNumber()
  @Min(0)
  @Max(20)
  public groupSize?: number;

}
