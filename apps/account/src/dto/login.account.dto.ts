import {
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class LoginAccountDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

}
