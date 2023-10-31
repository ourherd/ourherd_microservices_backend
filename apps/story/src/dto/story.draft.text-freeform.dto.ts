import { StoryDraftBaseDto } from "./story.draft.base.dto";
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { StoryMedium, StoryType } from "../constant/story.enum";
import { Transform } from "class-transformer";

export class StoryDraftTextFreeformDto extends StoryDraftBaseDto {

  static readonly TEXT_MIN_LENGTH: number = 1;
  static readonly TEXT_MAX_LENGTH: number = 3000;

  @IsString()
  @MinLength( StoryDraftTextFreeformDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength( StoryDraftTextFreeformDto.TEXT_MAX_LENGTH, { message: '' })
  @IsNotEmpty()
  public content: string;

  @Transform(({ value }) => value = StoryType.TEXT_FREE_FORM )
  @IsString()  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.TEXT_FREE_FORM;

  @Transform(({ value }) => value = StoryMedium.TEXT )
  @IsString()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.TEXT;


}
