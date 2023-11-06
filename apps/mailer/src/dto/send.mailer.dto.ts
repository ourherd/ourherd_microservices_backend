import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

@Exclude()
export class SendMailerDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Expose()
  @IsEmail()
  public email: string;
  
  @Expose()
  @ApiProperty({
    description: "email subject",
    example: "Test Sending Email"
  })
  public subject: string;
  
  @Expose()
  @ApiProperty({
    description: "email body",
    example: "<b>welcome</b>"
  })
  public html: string;

}
