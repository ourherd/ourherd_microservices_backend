import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class LoginAccountDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public password: string;

}
