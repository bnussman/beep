import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType } from "type-graphql";
import { Beep } from "./Beep";
import { User } from "./User";

@ObjectType()
@Entity()
export class Rating {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    rater!: User;

    @Field(() => User)
    @ManyToOne(() => User)
    rated!: User;

    @Field()
    @Property()
    stars!: number;

    @Field({ nullable: true })
    @Property({ nullable: true })
    message?: string;

    @Field()
    @Property()
    timestamp: number;

    @Field()
    @ManyToOne()
    beep?: Beep;

    constructor(rater: User, rated: User, stars: number, message?: string, beep?: Beep) {
        this.rater = rater;
        this.rated = rated;
        this.stars = stars;
        this.message = message;
        this.beep = beep;
        this.timestamp = Date.now();
    }
}
