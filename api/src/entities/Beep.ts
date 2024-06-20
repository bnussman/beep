import { Entity, Enum, Filter, Index, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

export enum Status {
  CANCELED = "canceled",
  DENIED = "denied",
  WAITING = "waiting",
  ACCEPTED = "accepted",
  ON_THE_WAY = "on_the_way",
  HERE = "here",
  IN_PROGRESS = "in_progress",
  COMPLETE = "complete",
}

@ObjectType()
@Entity()
@Filter({
  name: 'in',
  cond: (args) => ({ $or: [{ beeper: args.id }, { rider: args.id }] })
})
@Filter({
  name: 'inProgress',
  cond: {
    $and: [
      { status: { $ne: Status.DENIED } },
      { status: { $ne: Status.COMPLETE } },
      { status: { $ne: Status.CANCELED } },
    ]
  }
})
@Index({ properties: ["beeper", "rider"] })
export class Beep {
  constructor(values?: Partial<Beep>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  @PrimaryKey()
  @Field()
  id: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne(() => User)
  @Index()
  beeper!: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @Index()
  rider!: User;

  @Field()
  @Property()
  origin!: string;

  @Field()
  @Property()
  destination!: string;

  @Field()
  @Property()
  groupSize!: number;

  @Field()
  @Property()
  @Index()
  start!: Date;

  @Field(() => Date, { nullable: true })
  @Property({ type: 'datetime', nullable: true })
  end!: Date | null;

  @Field()
  @Enum(() => Status)
  @Index()
  status: Status = Status.COMPLETE;

  @Field()
  @Property({ persist: false })
  position: number = -1;
}
