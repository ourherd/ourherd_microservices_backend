import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
import { TagDto } from "./tag.dto";
import { StoryType } from "../../../story/src/constant/story.enum";
import { ReactionType } from "../../../story/src/entity/reaction/reaction.entity";
import { ResourceDto } from "./resource.dto";
import { StoryMemberDto } from "./story.member.dto";

export class StoryDto {

  @IsString()
  readonly id: string;

  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly has_hero_statement: boolean;

  @IsString()
  readonly hero_statement: string;

  @IsString()
  readonly story_type: StoryType;

  @IsString()
  readonly content: string;

  @IsString()
  readonly content_1: string;

  @IsString()
  readonly content_2: string;

  @IsString()
  readonly content_3: string;

  @IsString()
  readonly content_4: string;

  @IsNumber()
  readonly order: number;

  @IsArray()
  readonly tags: TagDto[]

  @IsBoolean()
  readonly is_saved: boolean;

  @IsBoolean()
  readonly has_reaction: boolean;

  @IsBoolean()
  readonly reaction_type: ReactionType;

  readonly resource: ResourceDto;

  readonly member: StoryMemberDto;


}
