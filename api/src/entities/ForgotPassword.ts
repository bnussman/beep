import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class ForgotPassword {

    @PrimaryKey()
    @Field()
    id: string = v4();

    @Field()
    @ManyToOne()
    user!: User;

    @Field()
    @Property({ defaultRaw: 'now()' }) 
    time!: Date;

    constructor(u: User) {
        this.user = u;
    }
}
