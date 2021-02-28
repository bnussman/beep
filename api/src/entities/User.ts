import { Cascade, Collection, Entity, Enum, OneToMany, PrimaryKey, Property, SerializedPrimaryKey, Unique } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Authorized, Field, ObjectType } from "type-graphql";
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
    @Property({ lazy: true })
    password?: string;

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

    @Field()
    @Enum()
    role: UserRole = UserRole.USER;

    @Field({ nullable: true })
    @Property({ nullable: true, lazy: true })
    @Authorized(UserRole.ADMIN)
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

