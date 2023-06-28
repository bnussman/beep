import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Report } from '../entities/Report';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ReportInput implements Partial<Report> {
  @Field(() => String)
  @IsString()
  public userId!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public reason!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public beepId?: string;
}

@InputType()
export class UpdateReportInput implements Partial<Report> {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  public handled?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public notes?: string;
}
