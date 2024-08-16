import { Entity, Filter, ManyToOne, PrimaryKey, Property, type Rel, Unique } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Beep } from "./Beep";
import { User } from "./User";

@ObjectType()
@Entity()
@Filter({ name: 'involved', cond: args => ({ $or: [{ rater: args.id } , { rated: args.id }] })})
@Filter({ name: 'given', cond: args => ({ rater: args.id }) })
@Filter({ name: 'recieved', cond: args => ({ rated: args.id }) })
@Unique({ properties: ['beep', 'rater'] })
export class Rating {

    @PrimaryKey()
    @Field(() => String)
    id: string = crypto.randomUUID();

    @Field(() => User)
    @ManyToOne(() => User)
    rater!: Rel<User>;

    @Field(() => User)
    @ManyToOne(() => User)
    rated!: Rel<User>;

    @Field(() => Number)
    @Property()
    stars!: number;

    @Field(() => String, { nullable: true })
    @Property({ nullable: true })
    message?: string;

    @Field(() => Date)
    @Property()
    timestamp: Date;

    @Field(() => Beep)
    @ManyToOne(() => Beep)
    beep!: Rel<Beep>;

    constructor(rater: Rel<User>, rated: Rel<User>, stars: number, beep: Rel<Beep>, message?: string) {
        this.rater = rater;
        this.rated = rated;
        this.stars = stars;
        this.message = message;
        this.beep = beep;
        this.timestamp = new Date();
    }
}
