import {
  IsEnum,
  IsOptional,
  IsBoolean
} from "class-validator";
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { RegisterAccountDto } from "apps/account/src/dto/register.account.dto";


export enum MemberStatus {
  ACTIVED = 'ACTIVATED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED'
}

export class CreateMemberDto extends PartialType(RegisterAccountDto) {

  @IsEnum(MemberStatus)
  @IsOptional()
  readonly status?: MemberStatus = MemberStatus.ACTIVED;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === false)
  readonly verified: boolean;

}
