import { IsEmail, IsString } from 'class-validator';

export class RefreshTokenAccountDto {

  @IsEmail()
  email: string;

  @IsString()
  refreshToken: string;

}
