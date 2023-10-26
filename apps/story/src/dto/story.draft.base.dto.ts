import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { Transform } from "class-transformer";
import { uuid } from "uuidv4";
import { StorySourceType, StoryStatus } from "../constant/story.enum";

export class StoryDraftBaseDto {

  @IsUUID()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value = uuid())
  public id: string = uuid();

  @IsUUID()
  @IsString()
  public member_id: string;

  @IsString()
  @IsOptional()
  @IsEnum(StoryStatus)
  @Transform(({ value }) => value = StoryStatus.DRAFT)
  public status: StoryStatus = StoryStatus.DRAFT;

  @IsString()
  @IsOptional()
  @IsEnum(StorySourceType)
  @Transform(({ value }) => value = StorySourceType.OURHERD_APP)
  public source: StorySourceType = StorySourceType.OURHERD_APP;

}
