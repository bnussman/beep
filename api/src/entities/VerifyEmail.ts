import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class VerifyEmail {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field()
    @ManyToOne()
    user!: User;

    @Field()
    @Property() 
    time: number = Date.now();

    @Field()
    @Property()
    email!: string;
    
    constructor(u: User, e: string) {
        this.user = u;
        this.email = e;
    }
}
