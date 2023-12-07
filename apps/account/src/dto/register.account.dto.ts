import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from "class-validator";
import { Exclude, Transform } from "class-transformer";
import { isValidBirthday } from "../validation/date.of.birth.validation"
import { v4 } from "uuid";
import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";
import { Role } from "@app/authentication/constant/roles.enum";

export class RegisterAccountDto {

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  public password: string;

  @ApiProperty({
    description: "Member birthday",
    example: '14/11/1992',
    required: true,
    type: String
  })
  @Matches(
    /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
    { message: 'invalid date of birth' },
  )
  @IsNotEmpty()
  @IsString()
  @isValidBirthday()
  public birthday: string;

  @ApiProperty({
    description: "Newsletter",
    example: true,
    required: false,
    type: Boolean
  })
  @IsBoolean()
  public newsletter: boolean = false;

  @IsEnum(Role)
  @IsOptional()
  @ApiHideProperty()
  @Exclude()
  readonly default_role?: Role = Role.MEMBER;

  @Exclude()
  @Transform(({ value }) => value = v4())
  public token: string = v4();

}
