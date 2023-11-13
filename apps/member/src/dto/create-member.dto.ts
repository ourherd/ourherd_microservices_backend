import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from 'uuid';
import { ApiProperty } from "@nestjs/swagger";

export enum MemberStatus {
  ACTIVATED = 'ACTIVATED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED'
}

export class CreateMemberDto  {

  @IsUUID()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string =  v4();

  @ApiProperty({
    description: 'Email address',
    pattern: '/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,3}$/g',
    example: 'hello@ourherd.io',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  @Transform(({ value }) => value.toString().toLowerCase())
  // TODO This is not working yet
  // @EmailNotRegistered({ message: 'email already registered' })
  public email: string;

  @ApiProperty({
    description: 'Password',
    pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$&+,:;=?@#|\'<>.^*()%!-])[A-Za-z\\d@$&+,:;=?@#|\'<>.^*()%!-]{8,}$/',
    example: '1Aaml1111*',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  public password: string;

}
