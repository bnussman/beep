import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Authorized, Field, ObjectType, UseMiddleware } from "type-graphql";
import { Rating } from './Rating';
import { v4 } from "uuid";
import { PointType } from "../location/types";
import { Point } from "../location/resolver";
import { Car } from "./Car";
import { Beep } from "./Beep";
import { MustBeInAcceptedBeep } from "../utils/decorators";

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
  @Field()
  id: string = v4();

  @Field()
  @Property()
  first!: string;

  @Field()
  @Property()
  last!: string;

  @Field()
  @Property()
  @Unique()
  username!: string;

  @Field({ nullable: true })
  @Property()
  @Unique()
  @UseMiddleware(MustBeInAcceptedBeep)
  email!: string;

  @Field({ nullable: true })
  @Property()
  @UseMiddleware(MustBeInAcceptedBeep)
  phone!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  venmo?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  cashapp?: string;

  @Field()
  @Property({ lazy: true })
  @Authorized(UserRole.ADMIN)
  password!: string;

  @Field()
  @Enum({ items: () => PasswordType, default: 'sha256', lazy: true })
  @Authorized(UserRole.ADMIN)
  passwordType!: PasswordType;

  @Field()
  @Property()
  isBeeping: boolean = false;

  @Field()
  @Property()
  isEmailVerified: boolean = false;

  @Field()
  @Property()
  isStudent: boolean = false;

  @Field()
  @Property()
  groupRate: number = 4.0;

  @Field()
  @Property()
  singlesRate: number = 3.0;

  @Field()
  @Property()
  capacity: number = 4;

  @Field()
  @Property()
  queueSize: number = 0;

  @Field({ nullable: true })
  @Property({ columnType: 'numeric', nullable: true })
  rating?: number;

  @Field()
  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @Field(() => String, { nullable: true })
  @Property({ type: String, nullable: true })
  @Authorized(UserRole.ADMIN)
  pushToken!: string | null;

  @Field({ nullable: true })
  @Property({ nullable: true })
  photo?: string;

  @Field(() => String)
  @Property({ persist: false })
  name(): string {
    return `${this.first} ${this.last}`;
  }

  @UseMiddleware(MustBeInAcceptedBeep)
  @Field({ nullable: true })
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

  @Field(() => [Car])
  @OneToMany(() => Car, r => r.user, { lazy: true, eager: false, orphanRemoval: true })
  @UseMiddleware(MustBeInAcceptedBeep)
  cars = new Collection<Car>(this);

  @Field({ nullable: true })
  @Property({ nullable: true })
  created: Date = new Date();
}
