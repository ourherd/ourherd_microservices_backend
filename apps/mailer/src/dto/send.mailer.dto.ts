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
  public email: string;
  
  @Expose()
  public subject: string;
  
  @Expose()
  public html: string;

}
