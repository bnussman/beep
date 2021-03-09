import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import {Field, ObjectType} from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Location {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    user!: User;

    @Field()
    @Property()
    latitude!: number;

    @Field()
    @Property()
    longitude!: number;

    @Field()
    @Property()
    altitude!: number;

    @Field()
    @Property()
    accuracy!: number;

    @Field()
    @Property()
    altitudeAccuracy!: number;

    @Field()
    @Property()
    heading!: number;

    @Field()
    @Property()
    speed!: number;

    @Field()
    @Property()
    timestamp: number = Date.now();

    constructor(data: Partial<Location>) {
        Object.assign(this, data);
    }
}
