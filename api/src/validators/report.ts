import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Report } from '../entities/Report';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ReportInput implements Partial<Report> {

  @Field()
  @IsString()
  public userId!: string;

  @Field()
  @IsString()
  public reason!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public beepId?: string;
}

@InputType()
export class UpdateReportInput implements Partial<Report> {
    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    public handled?: boolean;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    public notes?: string;
}
