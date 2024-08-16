import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Authorized, Field, ObjectType, UseMiddleware } from "type-graphql";
import { Rating } from './Rating';
import { PointType } from "../location/types";
import { Point } from "../location/resolver";
import { Car } from "./Car";
import { Beep } from "./Beep";
import { MustBeInAcceptedBeep } from "../utils/decorators";
import { Payment } from "./Payments";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum PasswordType {
  SHA256 = 'sha256',
  BCRYPT = 'bcrypt'
}

@ObjectType()
@Entity()
export class User {

  constructor(values?: Partial<User>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  @PrimaryKey()
  @Field(() => String)
  id: string = crypto.randomUUID();

  @Field(() => String)
  @Property()
  first!: string;

  @Field(() => String)
  @Property()
  last!: string;

  @Field(() => String)
  @Property()
  @Unique()
  username!: string;

  @Field(() => String, { nullable: true })
  @Property()
  @Unique()
  @UseMiddleware(MustBeInAcceptedBeep)
  email!: string;

  @Field(() => String, { nullable: true })
  @Property()
  @UseMiddleware(MustBeInAcceptedBeep)
  phone!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  venmo?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  cashapp?: string;

  @Field(() => String)
  @Property({ lazy: true })
  @Authorized(UserRole.ADMIN)
  password!: string;

  @Field(() => String)
  @Enum({ items: () => PasswordType, default: 'sha256', lazy: true })
  @Authorized(UserRole.ADMIN)
  passwordType!: PasswordType;

  @Field(() => Boolean)
  @Property()
  isBeeping: boolean = false;

  @Field(() => Boolean)
  @Property()
  isEmailVerified: boolean = false;

  @Field(() => Boolean)
  @Property()
  isStudent: boolean = false;

  @Field(() => Number)
  @Property()
  groupRate: number = 4.0;

  @Field(() => Number)
  @Property()
  singlesRate: number = 3.0;

  @Field(() => Number)
  @Property()
  capacity: number = 4;

  @Field(() => Number)
  @Property()
  queueSize: number = 0;

  @Field(() => Number, { nullable: true })
  @Property({ columnType: 'numeric', nullable: true })
  rating?: number;

  @Field(() => String)
  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @Field(() => String, { nullable: true })
  @Property({ type: String, nullable: true })
  @Authorized(UserRole.ADMIN)
  pushToken!: string | null;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  photo?: string;

  @Field(() => String)
  @Property({ persist: false })
  name(): string {
    return `${this.first} ${this.last}`;
  }

  @UseMiddleware(MustBeInAcceptedBeep)
  @Field(() => Point, { nullable: true })
  @Property({
    type: PointType,
    columnType: 'geometry',
    nullable: true,
  })
  location?: Point;

  @Field(() => [Beep])
  @OneToMany(() => Beep, q => q.beeper, { orphanRemoval: true, lazy: true, eager: false })
  queue = new Collection<Beep>(this);

  @Field(() => [Rating])
  @OneToMany(() => Rating, r => r.rated, { lazy: true, eager: false })
  ratings = new Collection<Rating>(this);

  @Field(() => [Car], { nullable: true })
  @OneToMany(() => Car, r => r.user, { lazy: true, eager: false, orphanRemoval: true })
  @UseMiddleware(MustBeInAcceptedBeep)
  cars = new Collection<Car>(this);

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, r => r.user, { lazy: true, eager: false, orphanRemoval: true })
  payments = new Collection<Payment>(this);

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  created: Date = new Date();
}
