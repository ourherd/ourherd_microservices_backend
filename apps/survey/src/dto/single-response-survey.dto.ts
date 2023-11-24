import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class SingleResponseSurveyDto {

  @ApiProperty({
    type: String,
    description: "This is the ID uuid related to table survey_member_instance"
  })
  @IsNotEmpty()
  public survey_member_instance_id: string;

  @ApiProperty()
  @IsNotEmpty()
  public question_number: string;

  @ApiProperty()
  @IsNotEmpty()
  public question_text: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public question_response: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  public question_response_scale: number;

}
