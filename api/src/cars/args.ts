import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/User';
import { ArgsType, Authorized, Field } from 'type-graphql';
import { IsMake, IsModelFor } from '../utils/validators';
import { FileScaler } from '../utils/scalers';

@ArgsType()
export class CarArgs {
  @Field()
  @IsString()
  @IsMake()
  public make!: string;

  @Field()
  @IsString()
  @IsModelFor("make")
  public model!: string;

  @Field()
  @IsNumber()
  public year!: number;

  @Field()
  @IsString()
  public color!: string;

  @Field(() => FileScaler, { nullable: true })
  @IsDefined({ message: "You must add a picture of your car" })
  public photo?: File;
}


@ArgsType()
export class EditCarArgs {
  @Field()
  @IsBoolean()
  public default!: boolean;
}

@ArgsType()
export class DeleteCarArgs {
  @Field()
  @IsString()
  public id!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Authorized(UserRole.ADMIN)
  public notification!: string;
}
