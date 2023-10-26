import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { uuid } from "uuidv4";

export enum MemberType {
  MEMBER = 'MEMBER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export class RegisterAccountDto {

  // @IsUUID()
  @IsOptional()
  @IsString()
  public id: string = uuid();

  // @IsUUID()
  @IsOptional()
  @IsString()
  public member_id: string = uuid();

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
