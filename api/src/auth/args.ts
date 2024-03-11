import { IsAlpha, IsDefined, IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '../entities/User';
import { IsStudent } from '../utils/validators';
import { FileScaler } from '../utils/scalers';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsString()
  public username!: string;

  @Field()
  @IsString()
  public password!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public pushToken?: string;
}

@InputType()
export class SignUpInput implements Partial<User> {

  @Field()
  @IsString()
  @IsNotEmpty()
  public username!: string;

  @Field()
  @IsAlpha()
  @IsNotEmpty()
  public first!: string;

  @Field()
  @IsAlpha()
  @IsNotEmpty()
  public last!: string;

  @Field()
  @IsMobilePhone("en-US")
  public phone!: string;

  @Field()
  @IsEmail()
  @IsStudent()
  public email!: string;

  @Field({ nullable: true })
  @IsString()
  public venmo?: string;

  @Field({ nullable: true })
  @IsString()
  public cashapp?: string;

  @Field()
  @IsString()
  @Length(5, 255)
  public password!: string;

  @Field(() => FileScaler, { nullable: true })
  @IsDefined({ message: "You must add a profile picture" })
  public picture?: File;

  @Field({ nullable: true })
  @IsString()
  public pushToken?: string;

}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsString()
  @Length(5, 255)
  password!: string;
}
