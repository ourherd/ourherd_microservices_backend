import { IsEnum, IsString, IsUUID, IsOptional, IsEmpty } from "class-validator";
import { Transform } from "class-transformer";

import { v4 } from "uuid";
import { StorySourceType, StoryStatus } from "../../constant/story.enum";

export class StoryDraftBaseDto {

  @IsUUID()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @IsUUID()
  @IsString()
  @IsOptional()
  @IsEmpty()
  public member_id: string;

  @IsString()
  @IsEnum(StoryStatus)
  @Transform(({ value }) => value = StoryStatus.DRAFT)
  readonly status: StoryStatus = StoryStatus.DRAFT;

  @IsString()
  @IsEnum(StorySourceType)
  @Transform(({ value }) => value = StorySourceType.OURHERD_APP)
  readonly source: StorySourceType = StorySourceType.OURHERD_APP;

}
