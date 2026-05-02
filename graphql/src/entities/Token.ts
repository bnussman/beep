import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Token {

  @PrimaryKey()
  @Field()
  id: string = crypto.randomUUID();

  @Field()
  @Property()
  tokenid: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  constructor(u: User) {
    this.user = u;
  }
}
