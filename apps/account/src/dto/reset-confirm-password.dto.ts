import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthConfirmPasswordUserDto {
  @IsEmail()
  @ApiProperty({
    description: "user email for matching account information",
    example: "info@batyr.com.au"
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: "confirmation code send to user email",
    example: "info@batyr.com.au"
  })
  confirmationCode: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  @ApiProperty({
    description: "for setup new password",
    example: "abc@12345"
  })
  newPassword: string;
}
