import { IsAlpha, Length, MinLength } from "class-validator";
import { ArgsType } from "type-graphql";
import { IsBoolean, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Authorized, Field, InputType } from 'type-graphql';
import { User, UserRole } from "../entities/User";
import { IsStudent } from "../utils/validators";

@ArgsType()
export class NotificationArgs {
  @Field(() => String)
  @MinLength(3)
  title!: string;

  @Field(() => String, { nullable: true })
  match?: string;

  @Field(() => String)
  @MinLength(5)
  body!: string;
}

@InputType()
export class EditUserInput implements Partial<User> {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsAlpha()
  public first?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsAlpha()
  public last?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  @IsStudent()
  public email?: string;

  @Field(() => String, { nullable: true })
  @IsMobilePhone("en-US")
  @IsOptional()
  public phone?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public venmo?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public cashapp?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  public isBeeping?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public isEmailVerified?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public isStudent?: boolean;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public groupRate?: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public singlesRate?: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(20)
  @IsOptional()
  public capacity?: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public queueSize?: number;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public role?: UserRole;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public pushToken?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public photo?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public username?: string;
}

@InputType()
export class ChangePasswordInput implements Partial<User> {
    @Field(() => String)
    @IsString()
    @Length(6, 512)
    password!: string;
}
