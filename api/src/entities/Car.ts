import { Field, ObjectType } from "type-graphql";
import { Entity, Property, PrimaryKey, ManyToOne } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class Car {
  @PrimaryKey()
  @Field()
  id: string = v4();

  @ManyToOne(() => User)
  @Field(() => User)
  user!: User;

  @Field()
  @Property()
  make!: string;

  @Field()
  @Property()
  model!: string;

  @Field()
  @Property()
  photo!: string;

  @Field()
  @Property()
  year!: number;

  @Field()
  @Property()
  created: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updated: Date = new Date();
}
