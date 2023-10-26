import { MemberEntity } from "apps/member/src/entity/member.entity";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { uuid } from "uuidv4";

export enum MemberType {
  MEMBER = 'MEMBER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export class RegisterAccountDto {

  @IsOptional()
  @IsString()
  public id: string = uuid();

  @IsOptional()
  public member_id: MemberEntity;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
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
