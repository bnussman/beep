import { Entity, Filter, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { Beep } from "./Beep";
import { User } from "./User";

@ObjectType()
@Entity()
@Filter({ name: 'in', cond: args => ({ $or: [{ reporter: args.id }, { reported: args.id }] }) })
export class Report {

  @PrimaryKey()
  @Field(() => String)
  id: string = v4();

  @Field(() => User)
  @ManyToOne()
  reporter!: User;

  @Field(() => User)
  @ManyToOne()
  reported!: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  handledBy?: User | null;

  @Field(() => String)
  @Property()
  reason!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  notes?: string;

  @Field(() => Date)
  @Property()
  timestamp: Date;

  @Field(() => Boolean)
  @Property({ default: false })
  handled: boolean = false;

  @Field(() => Beep, { nullable: true })
  @ManyToOne({ nullable: true })
  beep?: Beep;

  constructor(reporter: User, reported: User, reason: string, beep?: string) {
    this.reporter = reporter;
    this.reported = reported;
    this.reason = reason;
    this.timestamp = new Date();
    if (beep) {
      this.beep = beep as unknown as Beep;
    }
  }
}
