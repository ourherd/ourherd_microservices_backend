import { MemberEntity } from "apps/member/src/entity/member.entity";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from 'uuid';

export enum MemberType {
  MEMBER = 'MEMBER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export class RegisterAccountDto {

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @IsOptional()
  public member: MemberEntity

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  public password: string;

  @IsEnum(MemberType)
  @IsOptional()
  readonly default_role?: MemberType = MemberType.MEMBER;

}
