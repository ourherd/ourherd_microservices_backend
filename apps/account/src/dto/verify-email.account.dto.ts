import { IsEmail, IsString } from 'class-validator';

export class AuthVerifyUserDto {
  @IsEmail()
  email: string;

  @IsString()
  confirmationCode: string;
}