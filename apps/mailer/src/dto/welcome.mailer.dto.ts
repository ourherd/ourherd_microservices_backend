import {
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class WelcomeMailerDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public email: string;

}
