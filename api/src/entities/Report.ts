import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType } from "type-graphql";
import { Beep } from "./Beep";
import { User } from "./User";

@ObjectType()
@Entity()
export class Report {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field()
    @ManyToOne()
    reporter!: User;

    @Field()
    @ManyToOne()
    reported!: User;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { nullable: true })
    handledBy?: User | null;

    @Field()
    @Property()
    reason!: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    notes?: string;

    @Field()
    @Property()
    timestamp: number = Date.now();

    @Field()
    @Property({ default: false })
    handled: boolean = false;

    @Field({ nullable: true })
    @ManyToOne({ nullable: true })
    beep?: Beep;

    constructor(reporter: User, reported: User, reason: string, beep?: string) {
        this.reporter = reporter;
        this.reported = reported;
        this.reason = reason;
        if (beep) {
            this.beep = new ObjectId(beep) as unknown as Beep;
        }
    }
}
