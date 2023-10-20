import { MemberEntity } from "apps/member/src/entity/member.entity";
import {
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

export class TokenAccountDto {

  public member_id: MemberEntity;

  @IsNotEmpty()
  @IsString()
  public accessToken: string;
  
  @IsNotEmpty()
  @IsString()
  public refreshToken: string;

}
