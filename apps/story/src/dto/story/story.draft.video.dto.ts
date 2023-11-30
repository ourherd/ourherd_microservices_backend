import { IsEnum, IsString } from "class-validator";
import { StoryDraftBaseDto } from "./story.draft.base.dto";
import { Transform } from "class-transformer";
import { StoryMedium, StoryType } from "../../constant/story.enum";

export class StoryDraftVideoDto extends StoryDraftBaseDto {

  @Transform(({ value }) => value = StoryType.VIDEO_FREE_FORM )
  @IsString()
  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.VIDEO_FREE_FORM;

  @IsString()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.VIDEO;

}
