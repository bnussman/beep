import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class Location {

    @PrimaryKey()
    @Field()
    id: string = v4();

    @Field(() => User)
    @ManyToOne(() => User, { lazy: true, eager: false })
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
    @Property({ defaultRaw: 'now()' }) 
    timestamp!: Date;

    constructor(data: Partial<Location>) {
        Object.assign(this, data);
    }
}
