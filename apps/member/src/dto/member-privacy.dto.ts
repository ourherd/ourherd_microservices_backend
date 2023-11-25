import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MemberEntity } from "../entity/member.entity";

// TODO this is story settings DTO
export class MemberPrivacyDto  {

  @ApiProperty({})
  member: MemberEntity;

  @ApiProperty({})
  @IsBoolean()
  share_gender: boolean;

  @ApiProperty({})
  @IsBoolean()
  share_age: boolean;

  @ApiProperty({})
  @IsBoolean()
  share_name: boolean;

  @ApiProperty({})
  @IsBoolean()
  share_location: boolean;

}
