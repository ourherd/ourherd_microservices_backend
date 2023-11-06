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
  public subject: string;
  
  @Expose()
  public html: string;

}
