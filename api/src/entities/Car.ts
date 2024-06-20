import { Field, ObjectType } from "type-graphql";
import { Entity, Property, PrimaryKey, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";

@ObjectType()
@Entity()
export class Car {
  constructor(values?: Partial<Car>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  @PrimaryKey()
  @Field()
  id: string = crypto.randomUUID();

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
  color!: string;

  @Field()
  @Property()
  photo!: string;

  @Field()
  @Property()
  year!: number;

  @Field()
  @Property({ default: false })
  default!: boolean;

  @Field()
  @Property()
  created: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updated: Date = new Date();
}
