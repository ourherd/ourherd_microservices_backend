import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { AbstractSurveyDto } from "./base-survey.dto";

export class CreateInstanceSurveyDto extends AbstractSurveyDto {

  @ApiProperty({
    description: "This field is for a full name - long survey",
    required: false
  })
  @IsOptional()
  @IsString()
  public full_name: string;

  @ApiProperty({
    description: "This field is consent - long survey",
    required: false
  })
  @IsOptional()
  public consent?: boolean;

  @ApiProperty({
    description: "This field described the type of survey",
    type: "enum",
    example: "DQ5_MEMBER_STORY | LONG_SURVEY_ONBOARDING | SHORT_SURVEY_ONBOARDING"
  })
  @IsNotEmpty()
  @IsEnum(SURVEY_TYPE)
  public type: SURVEY_TYPE;

}
