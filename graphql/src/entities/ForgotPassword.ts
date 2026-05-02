import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class ForgotPassword {
  @PrimaryKey()
  @Field()
  id: string = crypto.randomUUID();

  @Field()
  @ManyToOne()
  user!: User;

  @Field()
  @Property()
  time: Date = new Date();

  constructor(u: User) {
    this.user = u;
  }
}
