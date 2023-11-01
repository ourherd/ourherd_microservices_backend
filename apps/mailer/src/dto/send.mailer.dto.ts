import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
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
  @ApiProperty({
    description: "recipient email",
    example: "info@batyr.com.au"
  })
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
