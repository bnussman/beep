import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { v4 } from 'uuid';

@ObjectType()
@Entity()
export class Beep {

    @PrimaryKey()
    @Field()
    id: string = v4();

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
    @Property({ defaultRaw: 'now()' }) 
    timeEnteredQueue!: Date;

    @Field()
    @Property()
    doneTime!: Date;
}
