import { BigIntType, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { v4 } from "uuid";

@ObjectType()
@Entity()
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
    state: number = 0;

    @Field()
    @Property({ default: false })
    isAccepted!: boolean;

    @Field()
    @Property()
    groupSize!: number;

    @Field()
    @Property({ type: BigIntType }) 
    start!: number;

    @Field(() => User)
    @ManyToOne(() => User)
    beeper!: User

    @Field(() => User)
    @ManyToOne(() => User)
    rider!: User;

    @Field()
    @Property({ persist: false })
    position?: number;

    constructor(values: Partial<QueueEntry>) {
        Object.assign(this, values);
    }
}
