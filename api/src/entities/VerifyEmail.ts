import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class VerifyEmail {
  @PrimaryKey()
  @Field()
  id: string = crypto.randomUUID();

  @Field()
  @ManyToOne()
  user!: User;

  @Field()
  @Property()
  time: Date = new Date();

  @Field()
  @Property()
  email!: string;

  constructor(u: User, e: string) {
    this.user = u;
    this.email = e;
  }
}
