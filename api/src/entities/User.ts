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
    @Property()
    isBeeping: boolean = false;

    @Field()
    @Property()
    isEmailVerified: boolean = false;

    @Field()
    @Property()
    isStudent: boolean = false;

    @Field()
    @Property()
    groupRate: number = 4.0;

    @Field()
    @Property()
    singlesRate: number = 3.0;

    @Field()
    @Property()
    capacity: number = 4;

    @Field()
    @Property() 
    masksRequired: boolean = false;

    @Field()
    @Property()
    queueSize: number = 0;

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


@ObjectType()
export class PartialUser {

    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    first?: string;

    @Field({ nullable: true })
    last?: string;

    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    venmo?: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    isBeeping?: boolean;

    @Field({ nullable: true })
    isEmailVerified?: boolean;

    @Field({ nullable: true })
    isStudent?: boolean;

    @Field({ nullable: true })
    groupRate?: number;

    @Field({ nullable: true })
    singlesRate?: number;

    @Field({ nullable: true })
    capacity?: number;

    @Field({ nullable: true })
    masksRequired?: boolean;

    @Field({ nullable: true })
    queueSize?: number;

    @Field({ nullable: true })
    role?: UserRole;

    @Field({ nullable: true })
    pushToken?: string;

    @Field({ nullable: true })
    photoUrl?: string;
}
