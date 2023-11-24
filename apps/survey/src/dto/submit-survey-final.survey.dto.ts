import { IsNotEmpty, IsUUID, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SingleResponseSurveyDto } from "./single-response-survey.dto";

export class SubmitSurveyFinalDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public survey_member_instance_id: string;

  @ApiProperty({
    minimum: 5,
    maximum: 28,
    isArray: true,
    type: SingleResponseSurveyDto,
  })
  @ArrayNotEmpty()
  @ArrayMinSize(5)
  @ArrayMaxSize(28)
  public data: SingleResponseSurveyDto[];

}
