import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { AbstractSurveyDto } from "./base-survey.dto";

export class CreateSurveyInstanceSurveyDto extends AbstractSurveyDto {

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
  public type: SURVEY_TYPE;

}
