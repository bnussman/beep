import { User } from '../entities/User';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class BeeperSettingsInput implements Partial<User> {
  @Field(() => Number, { nullable: true })
  @Max(200)
  @Min(0)
  @IsNumber()
  @IsOptional()
  public singlesRate?: number;

  @Field(() => Number, { nullable: true })
  @Max(200)
  @Min(0)
  @IsNumber()
  @IsOptional()
  public groupRate?: number;

  @Field(() => Number, { nullable: true })
  @Max(100)
  @Min(0)
  @IsNumber()
  @IsOptional()
  public capacity?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  public isBeeping?: boolean;

  @Field(() => Number, { nullable: true })
  @ValidateIf(o => o.isBeeping)
  @IsNumber()
  @IsDefined()
  public latitude?: number;

  @Field(() => Number, { nullable: true })
  @ValidateIf(o => o.isBeeping)
  @IsNumber()
  @IsDefined()
  public longitude?: number;
}

@InputType()
export class UpdateQueueEntryInput {
  @Field(() => String)
  @IsString()
  public id!: string;

  @Field(() => String)
  public status!: string;
}
