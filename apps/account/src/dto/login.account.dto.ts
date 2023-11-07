import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class LoginAccountDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public password: string;

}
