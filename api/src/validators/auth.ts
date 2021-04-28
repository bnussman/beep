import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import {Upload} from '../account/resolver';
import { Field, InputType } from 'type-graphql';
import { User } from '../entities/User';
import {GraphQLUpload} from 'graphql-upload';

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
  public username!: string;

  @Field()
  @IsString()
  public first!: string;

  @Field()
  @IsString()
  public last!: string;

  @Field()
  @IsMobilePhone("en-US")
  public phone!: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field({ nullable: true })
  @IsString()
  public venmo?: string;

  @Field({ nullable: true })
  @IsString()
  public cashapp?: string;

  @Field()
  @IsString()
  public password!: string;

  @Field(() => GraphQLUpload)
  public picture!: Upload;

  @Field({ nullable: true })
  @IsString()
  public pushToken?: string;

}
