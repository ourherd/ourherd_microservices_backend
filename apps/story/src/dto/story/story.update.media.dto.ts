import { Allow, IsString } from "class-validator";
import { StoryType } from "../../constant/story.enum";
import { ApiProperty } from "@nestjs/swagger";

export class StoryUpdateMediaDto {

  @ApiProperty({
    enum: StoryType,
    example: [StoryType.TEXT_GUIDED, StoryType.VIDEO_FREE_FORM, StoryType.TEXT_FREE_FORM],
    description: "Story type File resource to be uploaded"
  })
  @IsString()
  readonly story_type: StoryType

  @ApiProperty({
    description: "Video|Image Story Content",
    example: 'video.mp4 | image.png ',
    type: 'MP4|AVI|Vid'
  })
  @Allow()  public story_resource: Express.Multer.File

}
