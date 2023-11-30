import { IsEnum, IsString, IsUUID } from "class-validator";
import { Exclude, Transform } from "class-transformer";
import { v4 } from "uuid";
import { StorySourceType, StoryStatus } from "../../constant/story.enum";
import { STORY_DEFAULT_TITLE } from "../../constant/story-patterns.constants";

export class StoryDraftBaseDto {

  @IsUUID()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @Exclude()
  public member_id: string;

  @Transform(({ value }) => value = STORY_DEFAULT_TITLE )
  @IsString()
  readonly title: string = STORY_DEFAULT_TITLE;

  @IsString()
  @IsEnum(StoryStatus)
  @Transform(({ value }) => value = StoryStatus.DRAFT)
  readonly status: StoryStatus = StoryStatus.DRAFT;

  @IsString()
  @IsEnum(StorySourceType)
  @Transform(({ value }) => value = StorySourceType.OURHERD_APP)
  readonly source: StorySourceType = StorySourceType.OURHERD_APP;

}
