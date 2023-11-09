import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { Transform } from "class-transformer";

export class CreateShortBoardingSurveyInstanceDto {

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

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(SURVEY_TYPE)
  public type: SURVEY_TYPE = SURVEY_TYPE.SHORT_SURVEY_ONBOARDING;

}
