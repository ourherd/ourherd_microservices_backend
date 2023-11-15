import { Exclude, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { v4 } from "uuid";

@Exclude()
export class SendMailerDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @Transform(({ value }) => value = v4())
  public token: string = v4();

}
