import { IsBoolean, IsOptional, IsString } from "class-validator";

export class StoryMemberDto {

  @IsBoolean()
  share_name: boolean;

  @IsString()
  first_name: string;

  @IsBoolean()
  share_location: boolean;

  @IsString()
  country: string;

  @IsString()
  suburb: string;

  @IsString()
  postal_code: string;

  @IsBoolean()
  share_gender: boolean;

  @IsString()
  gender: string;

  @IsBoolean()
  share_age: boolean;

  @IsString()
  birthday: string;

}
