import { User } from '../entities/User';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsStudent } from './IsStudent';

@InputType()
export class EditAccountInput implements Partial<User> {

  @Field()
  @IsString()
  @IsNotEmpty()
  public first?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  public last?: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  @IsStudent()
  public email?: string;

  @Field()
  @IsMobilePhone("en-US")
  @IsNotEmpty()
  public phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public venmo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public cashapp?: string;
}

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsString()
    @Length(6, 512)
    password!: string;
}
