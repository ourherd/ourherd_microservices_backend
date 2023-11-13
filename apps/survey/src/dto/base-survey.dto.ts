import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export abstract class AbstractSurveyDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public survey_id: string;

  //TODO change this to exclude
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public member_id: string;

}
