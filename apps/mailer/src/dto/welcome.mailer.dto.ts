import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class WelcomeMailerDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: "recipient email",
    example: "info@batyr.com.au"
  })
  public email: string;

}
