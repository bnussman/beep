import { IsString } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class FeedbackArgs {
  @Field()
  @IsString()
  message!: string;
}
