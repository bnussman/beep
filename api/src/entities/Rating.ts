import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { Beep } from "./Beep";
import { User } from "./User";

@ObjectType()
@Entity()
export class Rating {

    @PrimaryKey()
    @Field()
    id: string = v4();

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
    @Property({ defaultRaw: 'now()' }) 
    timestamp!: Date;

    @Field(() => Beep)
    @ManyToOne(() => Beep)
    beep?: Beep;

    constructor(rater: User, rated: User, stars: number, message?: string, beep?: Beep) {
        this.rater = rater;
        this.rated = rated;
        this.stars = stars;
        this.message = message;
        this.beep = beep;
    }
}
