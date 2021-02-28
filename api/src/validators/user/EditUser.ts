import { User, UserRole } from '../../entities/User';
import { IsBoolean, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class EditUserValidator implements Partial<User> {

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public first?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public last?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
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
  public password?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public isBeeping?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public isEmailVerified?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public isStudent?: boolean;

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
  @IsBoolean()
  @IsOptional()
  public masksRequired?: boolean;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  public queueSize?: number;

  @Field({ nullable: true })
  @IsOptional()
  public role?: UserRole;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public pushToken?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public photoUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public username?: string;
}
