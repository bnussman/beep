import { Entity, Enum, Filter, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

export enum Store {
  PLAY_STORE = 'play_store',
  APP_STORE = 'app_store'
}

@ObjectType()
@Entity()
@Filter({
  name: 'in',
  cond: (args) => ({ user: args.id })
})
@Filter({
  name: 'active',
  cond: () => ({ expires: { '$gte': new Date() } })
})
export class Payment {
  constructor(values: Payment) {
    if (values) {
      Object.assign(this, values);
    }
  }

  @PrimaryKey()
  @Field()
  id!: string;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field()
  @Property()
  storeId!: string;

  @Field()
  @Property()
  productId!: string;

  @Field()
  @Enum(() => Store)
  store!: Store;

  @Field()
  @Property()
  created!: Date;

  @Field()
  @Property()
  expires!: Date;
}
