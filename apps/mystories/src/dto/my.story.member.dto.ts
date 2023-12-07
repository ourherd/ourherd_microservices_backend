import { Exclude, Expose } from "class-transformer";
import { BaseAbstractDto } from "./base.abstract.dto";

export class MyStoryMemberDto extends BaseAbstractDto {

  @Expose()
  public visibility: string;

  @Exclude()
  readonly updated_at?: string;

  @Exclude()
  public country: string;

  @Exclude()
  public suburb: string = '';

  @Exclude()
  public postal_code: number;

  @Exclude()
  public gender: string;

  @Exclude()
  share_name: boolean;

  @Exclude()
  share_location: boolean;

  @Exclude()
  share_gender: boolean;

  @Exclude()
  share_age: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly is_shareable: boolean;

  @Exclude()
  birthday: string;

  @Exclude()
  share_batyr_instragram: boolean;

  @Exclude()
  share_batyr_tiktok: boolean;

  @Exclude()
  share_contacted: boolean;

}
