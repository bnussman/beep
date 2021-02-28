import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Beep {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    beeper!: User;

    @Field(() => User)
    @ManyToOne(() => User)
    rider!: User;
    
    @Field()
    @Property()
    origin!: string;

    @Field()
    @Property()
    destination!: string;

    @Field()
    @Property({ default: 0 })
    state!: number;

    @Field()
    @Property({ default: false })
    isAccepted!: boolean;

    @Field()
    @Property()
    groupSize!: number;

    @Field()
    @Property()
    timeEnteredQueue: number = Date.now();

    @Field()
    @Property()
    doneTime!: number;
}
