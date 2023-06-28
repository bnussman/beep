import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class VerifyEmail {
  @PrimaryKey()
  @Field(() => String)
  id: string = v4();

  @Field(() => User)
  @ManyToOne()
  user!: User;

  @Field(() => Date)
  @Property()
  time: Date = new Date();

  @Field(() => String)
  @Property()
  email!: string;

  constructor(u: User, e: string) {
    this.user = u;
    this.email = e;
  }
}
