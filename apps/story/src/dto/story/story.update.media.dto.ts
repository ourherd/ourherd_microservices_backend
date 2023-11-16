import { Allow, IsEnum, IsString } from "class-validator";
import { StoryDraftBaseDto } from "./story.draft.base.dto";
import { Transform } from "class-transformer";
import { StoryMedium, StoryType } from "../../constant/story.enum";
import { ApiProperty } from "@nestjs/swagger";

export class StoryUpdateMediaDto {

  @IsString()
  @IsEnum(StoryType)
  readonly story_type: StoryType

}
