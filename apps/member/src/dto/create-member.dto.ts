import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { uuid } from "uuidv4";
import { ApiProperty } from "@nestjs/swagger";

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

}
