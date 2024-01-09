import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class Feedback {
  constructor(values?: Partial<Feedback>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  @PrimaryKey()
  @Field()
  id: string = v4();

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field()
  @Property()
  message!: string;

  @Field()
  @Property()
  created: Date = new Date();
}
