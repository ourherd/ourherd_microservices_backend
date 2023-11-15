import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MemberEntity } from "../entity/member.entity";

export class MemberPrivacyDto  {

  @ApiProperty({})
  member: MemberEntity;

  @ApiProperty({})
  @IsBoolean()
  share_gender: boolean = false;
  
  @ApiProperty({})
  @IsBoolean()
  share_age: boolean = false;
  
  @ApiProperty({})
  @IsBoolean()
  share_name: boolean = false;
  
  @ApiProperty({})
  @IsBoolean()
  share_location: boolean = false;

}
