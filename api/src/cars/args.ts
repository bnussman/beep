import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator';
import { GraphQLUpload, Upload } from 'graphql-upload';
import { ArgsType, Field } from 'type-graphql';
import { IsMake, IsModelFor } from '../validators/IsStudent';

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

  @Field(() => GraphQLUpload, { nullable: true })
  @IsDefined({ message: "You must add a picture of your car" })
  public photo?: Upload;
}


@ArgsType()
export class EditCarArgs {
  @Field()
  @IsBoolean()
  public default!: boolean;
}
