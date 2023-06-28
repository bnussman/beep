import { Field, ObjectType } from "type-graphql";
import { Entity, Property, PrimaryKey, ManyToOne } from "@mikro-orm/core";
import { v4 } from "uuid";
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
  @Field(() => String)
  id: string = v4();

  @ManyToOne(() => User)
  @Field(() => User)
  user!: User;

  @Field(() => String)
  @Property()
  make!: string;

  @Field(() => String)
  @Property()
  model!: string;

  @Field(() => String)
  @Property()
  color!: string;

  @Field(() => String)
  @Property()
  photo!: string;

  @Field(() => Number)
  @Property()
  year!: number;

  @Field(() => Boolean)
  @Property({ default: false })
  default!: boolean;

  @Field(() => Date)
  @Property()
  created: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updated: Date = new Date();
}
