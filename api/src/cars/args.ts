import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { GraphQLUpload, Upload } from 'graphql-upload-minimal';
import { UserRole } from '../entities/User';
import { ArgsType, Authorized, Field } from 'type-graphql';
import { IsMake, IsModelFor } from '../utils/validators';

@ArgsType()
export class CarArgs {
  @Field(() => String)
  @IsString()
  @IsMake()
  public make!: string;

  @Field(() => String)
  @IsString()
  @IsModelFor("make")
  public model!: string;

  @Field(() => Number)
  @IsNumber()
  public year!: number;

  @Field(() => String)
  @IsString()
  public color!: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsDefined({ message: "You must add a picture of your car" })
  public photo?: Upload;
}


@ArgsType()
export class EditCarArgs {
  @Field(() => Boolean)
  @IsBoolean()
  public default!: boolean;
}

@ArgsType()
export class DeleteCarArgs {
  @Field(() => String)
  @IsString()
  public id!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public notification!: string;
}
