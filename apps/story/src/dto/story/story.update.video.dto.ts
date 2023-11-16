import { Allow, IsEnum, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { StoryMedium, StoryType } from "../../constant/story.enum";
import { ApiProperty } from "@nestjs/swagger";
import { StoryUpdateBaseDto } from "./story.update.base.dto";

export class StoryUpdateVideoDto extends StoryUpdateBaseDto {

  @Transform(({ value }) => value = StoryType.VIDEO_FREE_FORM )
  @IsString()
  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.VIDEO_FREE_FORM;

  @IsString()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.VIDEO;

}
