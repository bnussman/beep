import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
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
    @OneToOne(() => User)
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

    @Field({ nullable: true })
    @Property({ nullable: true })
    accuracy!: number;

    @Field({ nullable: true })
    @Property({ nullable: true })
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
