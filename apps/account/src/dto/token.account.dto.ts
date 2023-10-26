import {
  IsNotEmpty,
  IsString
} from "class-validator";

export class TokenAccountDto {

  @IsNotEmpty()
  @IsString()
  public accessToken: string;

  @IsNotEmpty()
  @IsString()
  public refreshToken: string;

}
