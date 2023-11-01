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
  public password: string;

}
