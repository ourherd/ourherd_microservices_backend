import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { Exclude, Transform } from "class-transformer";
import { DateOfBirthValidation } from "../validation/date.of.birth.validation"
import { v4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@app/authentication/constant/roles.enum";

export class RegisterAccountDto {

  @ApiProperty()
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
    required: true
  })
  @DateOfBirthValidation()
  @IsNotEmpty()
  @IsString()
  public birthday: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty()
  readonly default_role?: Role = Role.MEMBER;

  @Exclude()
  @Transform(({ value }) => value = v4())
  public token: string = v4();

}
