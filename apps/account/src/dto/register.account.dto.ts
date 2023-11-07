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

export class RegisterAccountDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  public password: string;

  @IsEnum(MemberType)
  @IsOptional()
  @ApiProperty()
  readonly default_role?: MemberType = MemberType.MEMBER;

}
