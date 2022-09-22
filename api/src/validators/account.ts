import { User } from '../entities/User';
import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ChangePasswordInput implements Partial<User> {
    @Field()
    @IsString()
    @Length(6, 512)
    password!: string;
}
