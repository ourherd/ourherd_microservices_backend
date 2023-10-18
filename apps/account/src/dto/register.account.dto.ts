import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from "class-validator";
import { Transform } from "class-transformer";
import { uuid } from "uuidv4";

export enum MemberType {
  MEMBER = 'MEMBER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export class CreateAccountDto {

  @IsUUID()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value = uuid())
  public id: string;

  @IsUUID()
  @IsOptional()
  @IsString()
  public member_id: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public email: string;

  @IsEnum(MemberType)
  @IsOptional()
  readonly default_role?: MemberType = MemberType.MEMBER;

}
