import { IsEmail, Matches } from 'class-validator';
import { AuthConfirmPasswordUserDto } from './reset-confirm-password.dto';
import { PartialType } from '@nestjs/swagger';

export class AuthChangePasswordUserDto extends PartialType(AuthConfirmPasswordUserDto) {
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  currentPassword: string;
}