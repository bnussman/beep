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
    @Property({ columnType: 'numeric' })
    latitude!: number;

    @Field()
    @Property({ columnType: 'numeric' })
    longitude!: number;

    @Field()
    @Property({ columnType: 'numeric' })
    altitude!: number;

    @Field({ nullable: true })
    @Property({ columnType: 'numeric', nullable: true })
    accuracy!: number;

    @Field({ nullable: true })
    @Property({ columnType: 'numeric', nullable: true })
    altitudeAccuracy!: number;

    @Field()
    @Property({ columnType: 'numeric' })
    heading!: number;

    @Field()
    @Property({ columnType: 'numeric' })
    speed!: number;

    @Field()
    @Property({ defaultRaw: 'now()' }) 
    timestamp!: Date;

    constructor(data: Partial<Location>) {
        Object.assign(this, data);
    }
}
