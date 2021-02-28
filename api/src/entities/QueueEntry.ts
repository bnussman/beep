import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Location } from "./Location";

@ObjectType()
@Entity()
export class QueueEntry {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;
    
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
    @Property()
    timeEnteredQueue!: number;

    @Field(() => User)
    @ManyToOne(() => User)
    beeper!: User

    @Field(() => User)
    @ManyToOne(() => User)
    rider!: User;

    @Field()
    @Property({ persist: false })
    ridersQueuePosition?: number;

    @Field(() => Location, { nullable: true })
    @Property({ persist: false, nullable: true })
    location?: Location;
}
