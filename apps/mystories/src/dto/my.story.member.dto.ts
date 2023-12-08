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

  @Expose()
  share_name: boolean;

  @Expose()
  share_location: boolean;

  @Expose()
  share_gender: boolean;

  @Expose()
  share_age: boolean;

  @Exclude()
  readonly id: string;

  @Expose()
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
