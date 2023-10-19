import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum, IsOptional } from "class-validator";
import { IsEmailUserAlreadyExist } from '@app/common/validation-rules/email-not-registered.rule';

export enum MemberStatus {
  ACTIVED = 'ACTIVATED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED'
}

export class CreateMemberDto  {

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  //@IsEmailUserAlreadyExist({ message: 'email already registered' })
  public email: string;

  @IsEnum(MemberStatus)
  @IsOptional()
  readonly status?: MemberStatus = MemberStatus.ACTIVED;

}
