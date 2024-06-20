import { Entity, Filter, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Beep } from "./Beep";
import { User } from "./User";

@ObjectType()
@Entity()
@Filter({ name: 'in', cond: args => ({ $or: [{ reporter: args.id }, { reported: args.id }] }) })
export class Report {

  @PrimaryKey()
  @Field()
  id: string = crypto.randomUUID();

  @Field()
  @ManyToOne()
  reporter!: User;

  @Field()
  @ManyToOne()
  reported!: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  handledBy?: User | null;

  @Field()
  @Property()
  reason!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  notes?: string;

  @Field()
  @Property()
  timestamp: Date;

  @Field()
  @Property({ default: false })
  handled: boolean = false;

  @Field({ nullable: true })
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
