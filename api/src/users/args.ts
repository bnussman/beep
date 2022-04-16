import { MinLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class NotificationArgs {
  @Field()
  @MinLength(3)
  title!: string;

  @Field({ nullable: true })
  match?: string;

  @Field()
  @MinLength(5)
  body!: string;
}