import { IsEnum, IsString } from "class-validator";
import { StoryMedium, StoryType } from "../../constant/story.enum";
import { StoryUpdateBaseDto } from "./story.update.base.dto";

export class StoryUpdateVideoDto extends StoryUpdateBaseDto {

  @IsString()
  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.VIDEO_FREE_FORM;

  @IsString()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.VIDEO;

}
