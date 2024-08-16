import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class ForgotPassword {
  @PrimaryKey()
  @Field(() => String)
  id: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne()
  user!: User;

  @Field(() => Date)
  @Property()
  time: Date = new Date();

  constructor(u: User) {
    this.user = u;
  }
}
