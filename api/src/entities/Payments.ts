import { Entity, Enum, Filter, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

export enum Store {
  PLAY_STORE = 'play_store',
  APP_STORE = 'app_store'
}

export enum Product {
  TOP_OF_BEEPER_LIST_1_HOUR = 'top_of_beeper_list_1_hour',
  TOP_OF_BEEPER_LIST_2_HOURS = 'top_of_beeper_list_2_hours',
  TOP_OF_BEEPER_LIST_3_HOURS = 'top_of_beeper_list_3_hours',
}

export const productExpireTimes: Record<Product, number> = {
  [Product.TOP_OF_BEEPER_LIST_1_HOUR]: (1 * 60 * 60 * 1000),
  [Product.TOP_OF_BEEPER_LIST_2_HOURS]: (2 * 60 * 60 * 1000),
  [Product.TOP_OF_BEEPER_LIST_3_HOURS]: (3 * 60 * 60 * 1000),
}

export const productPrice: Record<Product, number> = {
  [Product.TOP_OF_BEEPER_LIST_1_HOUR]: 0.99,
  [Product.TOP_OF_BEEPER_LIST_2_HOURS]: 1.99,
  [Product.TOP_OF_BEEPER_LIST_3_HOURS]: 2.99,
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
  @Enum(() => Product)
  productId!: Product;

  @Field()
  @Property({ columnType: "numeric" })
  price!: number;

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
