import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import {Field, ObjectType} from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class TokenEntry {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field(() => String)
    @Property() 
    tokenid = new ObjectId();

    @Field(() => User)
    @ManyToOne()
    user!: User;
    
    constructor(u: User) {
        this.user = u;
    }
}
