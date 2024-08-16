import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRole } from "../entities/User";
import { ArgsType, Authorized, Field } from "type-graphql";
import { IsMake, IsModelFor } from "../utils/validators";
import { FileScaler } from "../utils/scalers";

@ArgsType()
export class CarArgs {
  @Field(() => String)
  @IsString()
  @IsMake()
  public make!: string;

  @Field(() => String)
  @IsString()
  @IsModelFor("make", {
    message: "The model you selected is not a model of the selected make.",
  })
  public model!: string;

  @Field(() => Number)
  @IsNumber()
  public year!: number;

  @Field(() => String)
  @IsString()
  public color!: string;

  @Field(() => FileScaler, { nullable: true })
  @IsDefined({ message: "You must add a picture of your car" })
  public photo?: File;
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
