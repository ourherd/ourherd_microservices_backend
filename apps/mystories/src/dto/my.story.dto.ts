import { IsArray, IsOptional } from "class-validator";
import { TagDto } from "./tag.dto";
import { MyStoryMemberDto } from "./my.story.member.dto";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { BaseAbstractDto } from "./base.abstract.dto";
import { parseDMY } from "@app/common/string/string-first-uppercase";

export class MyStoryDto extends BaseAbstractDto {

  @Expose()
  @Transform(({ value }) => parseDMY(value.toString()))
  readonly updated_at: string;

  @Expose()
  public id: string;

  @Expose()
  public member_id: string;

  @Expose()
  public title: string;

  @Expose()
  public story_medium: string;

  @Expose()
  public story_type: string;

  @Expose()
  readonly source: string;

  @Exclude()
  readonly ranking: number;

  @Exclude()
  readonly revision: number;

  @Exclude()
  readonly order: number;

  @Exclude()
  readonly has_hero_statement: boolean;

  @Exclude()
  readonly hero_statement: string;

  @Exclude()
  readonly story_status: string;

  @Exclude()
  readonly content: string;

  @Exclude()
  readonly content_1: string;

  @Exclude()
  readonly content_2: string;

  @Exclude()
  readonly content_3: string;

  @Exclude()
  readonly content_4: string;

  @IsArray()
  tags: TagDto[]

  @Expose()
  @IsOptional()
  @Type(() => MyStoryMemberDto)
  settings: MyStoryMemberDto;

}
