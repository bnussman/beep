import { BigIntType, Entity, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { v4 } from "uuid";

enum State {
  DENIED = -1,
  WAITING = 0,
  ACCEPTED = 1,
  ON_THE_WAY = 2,
  HERE = 3,
  IN_PROGRESS = 4,
  COMPLETE = 5,
}

@ObjectType()
@Entity()
@Unique({ properties: ['rider'] })
export class QueueEntry {

    @PrimaryKey()
    @Field()
    id: string = v4();
    
    @Field()
    @Property()
    origin!: string;

    @Field()
    @Property()
    destination!: string;

    @Field()
    @Property()
    state: State = 0;

    @Field()
    @Property()
    groupSize!: number;

    @Field()
    @Property({ type: BigIntType }) 
    start: number = Math.floor(Date.now() / 1000);

    @Field(() => User)
    @ManyToOne(() => User)
    beeper!: User

    @Field(() => User)
    @ManyToOne(() => User)
    rider!: User;

    @Field()
    @Property({ persist: false })
    position: number = -1;

    constructor(values: Partial<QueueEntry>) {
        Object.assign(this, values);
    }
}
