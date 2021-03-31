import { User } from '../entities/User';
import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class EditAccountInput implements Partial<User> {

  @Field()
  @IsString()
  public first?: string;

  @Field()
  @IsString()
  public last?: string;

  @Field()
  @IsEmail()
  public email?: string;

  @Field()
  @IsMobilePhone("en-US")
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
