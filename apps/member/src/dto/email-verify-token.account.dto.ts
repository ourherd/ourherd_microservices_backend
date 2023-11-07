import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailVerifyTokenDto {
  @IsEmail()
  @ApiProperty({
    description: "user email for matching account information",
    example: "info@batyr.com.au"
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: "token for sending email to user in link",
    example: "b10aee82-5393-4517-8025-6deb707fa453"
  })
  token: string;
}