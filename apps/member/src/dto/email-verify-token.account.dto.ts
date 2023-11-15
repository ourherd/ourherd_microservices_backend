import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Exclude, Transform } from "class-transformer";
import { v4 } from "uuid";

export class EmailVerifyTokenDto {
  @IsEmail()
  @ApiProperty({
    description: "user email for matching account information",
    example: "info@batyr.com.au"
  })
  email: string;

  @Exclude()
  member_id: string;

  @IsString()
  @ApiProperty({
    description: "token for sending email to user in link",
    example: "b10aee82-5393-4517-8025-6deb707fa453"
  })
  @Transform(({ value }) => value = v4())
  token: string = v4();
}
