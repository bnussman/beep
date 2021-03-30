import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, SerializedPrimaryKey, Unique } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType } from "type-graphql";
import { QueueEntry } from './QueueEntry';
import { Location } from './Location';
import { Rating } from './Rating';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

@ObjectType()
@Entity()
export class User {

    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Field()
    @Property()
    first!: string;

    @Field()
    @Property()
    last!: string;

    @Field()
    @Property()
    @Unique()
    username!: string;

    @Field()
    @Property()
    @Unique()
    email!: string;

    @Field()
    @Property()
    phone!: string;

    @Field()
    @Property()
    venmo!: string;

    @Field()
    @Property()
    password!: string;

    @Field()
    @Property({ default: false })
    isBeeping!: boolean;

    @Field()
    @Property({ default: false })
    isEmailVerified!: boolean;

    @Field()
    @Property({ default: false })
    isStudent!: boolean;

    @Field()
    @Property({ default: 2.0 })
    groupRate!: number;

    @Field()
    @Property({ default: 3.0 })
    singlesRate!: number;

    @Field()
    @Property({ default: 4 })
    capacity!: number;

    @Field()
    @Property({ default: false }) 
    masksRequired!: boolean;

    @Field()
    @Property({ default: 0 })
    queueSize!: number;

    @Field({ nullable: true })
    @Property({ nullable: true })
    rating?: number;

    @Field()
    @Enum()
    role: UserRole = UserRole.USER;

    @Field({ nullable: true })
    @Property({ nullable: true })
    pushToken?: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    photoUrl?: string;

    @Field()
    @Property({ persist: false })
    get name(): string {
        return `${this.first} ${this.last}`;
    }

    @Field(() => [QueueEntry])
    @OneToMany(() => QueueEntry, q => q.beeper, { lazy: true, eager: false })
    queue = new Collection<QueueEntry>(this);

    @Field(() => [Location])
    @OneToMany(() => Location, l => l.user, { lazy: true, eager: false })
    locations = new Collection<Location>(this);

    @Field(() => [Rating])
    @OneToMany(() => Rating, r => r.rated, { lazy: true, eager: false })
    ratings = new Collection<Rating>(this);
}
