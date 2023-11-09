import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SurveyFinalResponseEntity } from "../entities/survey-final-responses.entity";

export class SubmitSurveyFinalDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public survey_instance_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty()
  public data: SurveyFinalResponseEntity[];

}
