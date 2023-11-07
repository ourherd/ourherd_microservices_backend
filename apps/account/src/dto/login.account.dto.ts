import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class LoginAccountDto {

  @ApiProperty({
    description: "Email",
    pattern: '/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,3}$/g',
    example: 'hello@ourherd.io'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: "Password",
    example: 'OSSherd4#io',
    pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$&+,:;=?@#|\'<>.^*()%!-])[A-Za-z\\d@$&+,:;=?@#|\'<>.^*()%!-]{8,}$/'
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public password: string;

}
