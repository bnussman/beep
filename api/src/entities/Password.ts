import { Entity, Enum, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { User } from "./User";

export enum PasswordType {
  SHA256 = 'sha256',
  BCRYPT = 'bcrypt'
}

@ObjectType()
@Entity()
export class Password {
  constructor(values?: Partial<Password>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  @PrimaryKey()
  @Field()
  id: string = v4();

  @OneToOne(() => User, user => user.password)
  user!: User;

  @Field()
  @Enum(() => PasswordType)
  type!: PasswordType;

  @Field()
  @Property()
  password!: string;

  @Field()
  @Property()
  created: Date = new Date();
}