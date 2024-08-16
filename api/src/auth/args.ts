import { IsAlpha, IsDefined, IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '../entities/User';
import { IsStudent } from '../utils/validators';
import { FileScaler } from '../utils/scalers';

@InputType()
export class LoginInput implements Partial<User> {
  @Field(() => String)
  @IsString()
  public username!: string;

  @Field(() => String)
  @IsString()
  public password!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public pushToken?: string;
}

@InputType()
export class SignUpInput implements Partial<User> {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public username!: string;

  @Field(() => String)
  @IsAlpha()
  @IsNotEmpty()
  public first!: string;

  @Field(() => String)
  @IsAlpha()
  @IsNotEmpty()
  public last!: string;

  @Field(() => String)
  @IsMobilePhone("en-US")
  public phone!: string;

  @Field(() => String)
  @IsEmail()
  @IsStudent()
  public email!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  public venmo?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  public cashapp?: string;

  @Field(() => String)
  @IsString()
  @Length(5, 255)
  public password!: string;

  @Field(() => FileScaler, { nullable: true })
  @IsDefined({ message: "You must add a profile picture" })
  public picture?: File;

  @Field(() => String, { nullable: true })
  @IsString()
  public pushToken?: string;

}

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsString()
  @Length(5, 255)
  password!: string;
}
