import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthForgotPasswordUserDto {
  @IsEmail()
  @ApiProperty({
    description: "for sending the reset code to email",
    example: "info@batyr.com.au"
  })
  email: string;
}