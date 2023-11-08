import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyUserDto {

  @ApiProperty({
    description: "user email for matching account information",
    example: "info@batyr.com.au"
  })
  @IsEmail()
  email: string;


  @ApiProperty({
    description: "for receiving token code from verify link",
    example: "b10aee82-5393-4517-8025-6deb707fa453"
  })
  @IsString()
  confirmationCode: string;

}
