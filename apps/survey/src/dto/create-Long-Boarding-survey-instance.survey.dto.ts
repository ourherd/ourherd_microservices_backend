import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { Transform } from "class-transformer";

export class CreateLongBoardingSurveyInstanceDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public id: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public survey_id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public member_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public full_name: string;

  @IsNotEmpty()
  @ApiProperty()
  public consent?: boolean;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(SURVEY_TYPE)
  public type: SURVEY_TYPE = SURVEY_TYPE.LONG_SURVEY_ONBOARDING;

}
