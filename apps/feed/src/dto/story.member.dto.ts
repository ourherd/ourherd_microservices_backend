import { Exclude, Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { BaseAbstractDto } from "./base.abstract.dto";

export class StoryMemberDto extends BaseAbstractDto {

  public display_name: string;

  public first_name?: string;

  @IsOptional()
  public country: string;

  @IsOptional()
  public suburb: string = '';

  @IsOptional()
  public postal_code: number;

  @IsOptional()
  public gender: string;

  share_name: boolean;

  share_location: boolean;

  share_gender: boolean;

  share_age: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly is_shareable: boolean;

  @Exclude()
  readonly visibility

  @Exclude()
  birthday: string;
  @Exclude()
  share_batyr_instragram: boolean;
  @Exclude()
  share_batyr_tiktok: boolean;
  @Exclude()
  share_contacted: boolean;

}
