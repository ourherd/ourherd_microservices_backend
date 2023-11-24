import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from "uuid";

export abstract class AbstractSurveyDto {

  @ApiProperty()
  @IsUUID()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public survey_id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public member_id: string;

}
