import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from 'uuid';
import { ApiProperty } from "@nestjs/swagger";

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
  // @EmailNotRegistered({ message: 'email already registered' })
  public email: string;

  @ApiProperty({
    description: "Member birthday",
    example: '14/11/1992',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  public birthday: string;

  @ApiProperty({
    description: "Newsletter",
    example: true,
    required: false,
    type: Boolean
  })
  @IsBoolean()
  public newsletter: boolean = false;

}
