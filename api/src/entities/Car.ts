import { Field, ObjectType } from "type-graphql";
import { Entity, Property, PrimaryKey } from "@mikro-orm/core";
import { v4 } from "uuid";

@ObjectType()
@Entity()
export class Car {
  @PrimaryKey()
  @Field()
  id: string = v4();

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
