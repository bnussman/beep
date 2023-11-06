import { IsAlpha, Length, MinLength } from "class-validator";
import { ArgsType } from "type-graphql";
import { IsBoolean, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Authorized, Field, InputType } from 'type-graphql';
import { User, UserRole } from "../entities/User";
import { IsStudent } from "../utils/validators";

@ArgsType()
export class NotificationArgs {
  @Field()
  @MinLength(3)
  title!: string;

  @Field({ nullable: true })
  match?: string;

  @Field()
  @MinLength(5)
  body!: string;
}

@InputType()
export class EditUserInput implements Partial<User> {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsAlpha()
  public first?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsAlpha()
  public last?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  @IsStudent()
  public email?: string;

  @Field({ nullable: true })
  @IsMobilePhone("en-US")
  @IsOptional()
  public phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public venmo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public cashapp?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public isBeeping?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public isEmailVerified?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public isStudent?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public isPremium?: boolean;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public groupRate?: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public singlesRate?: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(20)
  @IsOptional()
  public capacity?: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public queueSize?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public role?: UserRole;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public pushToken?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public photo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public username?: string;
}

@InputType()
export class ChangePasswordInput implements Partial<User> {
    @Field()
    @IsString()
    @Length(6, 512)
    password!: string;
}
