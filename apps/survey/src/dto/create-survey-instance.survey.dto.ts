import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSurveyInstanceDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public survey_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public member_id: string;

  @ApiProperty()
  @IsString()
  public full_name: string;

  @IsOptional()
  @ApiProperty()
  public consent?: boolean;

}
