import { MemberEntity } from "apps/member/src/entity/member.entity";
import {
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class TokenAccountDto {

  @IsNotEmpty()
  @IsString()
  public accessToken: string;
  
  @IsNotEmpty()
  @IsString()
  public refreshToken: string;

}
