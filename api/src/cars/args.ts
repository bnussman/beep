import { IsDefined, IsNumber, IsString } from 'class-validator';
import { GraphQLUpload, Upload } from 'graphql-upload';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CarArgs {
  @Field()
  @IsString()
  public make!: string;

  @Field()
  @IsString()
  public model!: string;

  @Field()
  @IsNumber()
  public year!: number;

  @Field()
  @IsString()
  public color!: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsDefined({ message: "You must add a profile picture" })
  public photo?: Upload;
}
