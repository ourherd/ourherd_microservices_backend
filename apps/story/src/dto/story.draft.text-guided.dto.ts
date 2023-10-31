import { StoryDraftBaseDto } from "./story.draft.base.dto";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, maxLength, MinLength, minLength } from "class-validator";
import { Transform } from "class-transformer";
import { StoryMedium, StoryType } from "../constant/story.enum";

export class StoryDraftTextGuidedDto extends StoryDraftBaseDto {

  static readonly TEXT_MIN_LENGTH: number = 1;
  static readonly TEXT_MAX_LENGTH: number = 750;

  @MinLength(StoryDraftTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryDraftTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_1: string;

  @MinLength(StoryDraftTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryDraftTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_2: string;

  @MinLength(StoryDraftTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryDraftTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_3: string;

  @MinLength(StoryDraftTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryDraftTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_4: string;

  @Transform(({ value }) => value = StoryType.TEXT_GUIDED )
  @IsString()
  @IsOptional()
  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.TEXT_GUIDED;

  @IsString()
  @IsOptional()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.TEXT;

}
