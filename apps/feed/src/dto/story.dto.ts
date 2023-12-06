import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { TagDto } from "./tag.dto";
import { StoryType } from "../../../story/src/constant/story.enum";
import { ReactionType } from "../../../story/src/entity/reaction/reaction.entity";
import { ResourceDto } from "./resource.dto";
import { StoryMemberDto } from "./story.member.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { BaseAbstractDto } from "./base.abstract.dto";

export class StoryDto extends BaseAbstractDto {

  readonly id: string;

  readonly member_id: string;

  readonly title: string;

  readonly has_hero_statement: boolean;

  readonly hero_statement: string;

  readonly story_status: string;

  readonly story_type: StoryType;

  readonly content: string;

  readonly content_1: string;

  readonly content_2: string;

  readonly content_3: string;

  readonly content_4: string;

  readonly order: number;

  @Exclude()
  readonly ranking: number;

  @Exclude()
  readonly revision: number;

  @IsArray()
  tags: TagDto[]

  @IsBoolean()
  is_saved: boolean;

  @IsBoolean()
  has_reaction: boolean;

  @IsString()
  reaction_type: ReactionType;

  @Expose()
  @Type(() => ResourceDto)
  resource: ResourceDto;

  @Expose()
  @IsOptional()
  @Type(() => StoryMemberDto)
  settings: StoryMemberDto;


}
