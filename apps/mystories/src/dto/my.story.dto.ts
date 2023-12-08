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
  public title: string;

  @Expose()
  public story_medium: string;

  @Expose()
  public story_type: string;

  @Expose()
  public member_id: string;

  @Exclude()
  readonly source: string;

  @Exclude()
  readonly ranking: number;

  @Exclude()
  readonly revision: number;

  @Expose()
  readonly order: number;

  @Expose()
  readonly has_hero_statement: boolean;

  @Expose()
  readonly hero_statement: string;

  @Expose()
  readonly story_status: string;

  @Expose()
  readonly content: string;

  @Expose()
  readonly content_1: string;

  @Expose()
  readonly content_2: string;

  @Expose()
  readonly content_3: string;

  @Expose()
  readonly content_4: string;

  @IsArray()
  tags: TagDto[]

  @Expose()
  @IsOptional()
  @Type(() => MyStoryMemberDto)
  settings: MyStoryMemberDto;

}