import { User } from '../entities/User';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class BeeperSettingsInput implements Partial<User> {

  @Field({ nullable: true })
  @Max(200)
  @Min(0)
  @IsNumber()
  @IsOptional()
  public singlesRate?: number;

  @Field({ nullable: true })
  @Max(200)
  @Min(0)
  @IsNumber()
  @IsOptional()
  public groupRate?: number;

  @Field({ nullable: true })
  @Max(100)
  @Min(0)
  @IsNumber()
  @IsOptional()
  public capacity?: number;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public isBeeping?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public masksRequired?: boolean;

  @Field({ nullable: true })
  @ValidateIf(o => o.isBeeping)
  @IsNumber()
  @IsDefined()
  public latitude?: number;

  @Field({ nullable: true })
  @ValidateIf(o => o.isBeeping)
  @IsNumber()
  @IsDefined()
  public longitude?: number;
}

@InputType()
export class UpdateQueueEntryInput {

  @Field()
  @IsString()
  public value!: string;

  @Field()
  @IsString()
  public riderId!: string;

  @Field()
  @IsString()
  public queueId!: string;
}
