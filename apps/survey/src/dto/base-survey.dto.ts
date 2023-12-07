import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export abstract class AbstractSurveyDto {

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  public id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public survey_id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public member_id: string;

}
