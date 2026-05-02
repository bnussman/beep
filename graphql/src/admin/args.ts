import { IsNumber, IsString } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CarArgs {
  @Field()
  @IsNumber()
  public amount!: number;

  @Field()
  @IsString()
  public username!: string;

  @Field()
  @IsString()
  public note!: string;
}