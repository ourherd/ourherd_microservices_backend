import { IsEmail, IsString } from 'class-validator';

export class EmailVerifyTokenDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}