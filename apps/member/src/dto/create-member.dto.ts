import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean
} from "class-validator";
import { Transform } from 'class-transformer';
import { uuid } from "uuidv4";

export enum MemberStatus {
  ACTIVED = 'ACTIVATED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED'
}

export class CreateMemberDto  {

  @IsUUID()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value = uuid())
  public id: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  @Transform(({ value }) => value.toString().toLowerCase())
  //@IsEmailUserAlreadyExist({ message: 'email already registered' })
  public email: string;

  @IsEnum(MemberStatus)
  @IsOptional()
  readonly status?: MemberStatus = MemberStatus.ACTIVED;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === false)
  readonly verified: boolean;

}
