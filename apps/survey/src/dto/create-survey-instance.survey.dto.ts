import { MemberEntity } from "apps/member/src/entity/member.entity";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from 'uuid';
import { ApiProperty } from "@nestjs/swagger";

export enum MemberType {
  MEMBER = 'MEMBER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

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
