import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { AbstractSurveyDto } from "./base-survey.dto";

export class CreateShortOnBoardingSurveyInstanceDto extends AbstractSurveyDto {

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(SURVEY_TYPE)
  public type: SURVEY_TYPE = SURVEY_TYPE.SHORT_SURVEY_ONBOARDING;

}
