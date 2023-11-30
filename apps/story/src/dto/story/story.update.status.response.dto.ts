import { IsEnum, IsString, IsUUID, IsOptional } from "class-validator";
import { v4 } from "uuid";
import { StoryStatus } from "../../constant/story.enum";

export class StoryUpdateStatusResponseDto {

  @IsUUID()
  @IsString()
  public id: string = v4();

  @IsUUID()
  @IsString()
  public member_id: string;

  @IsString()
  @IsEnum(StoryStatus)
  public status: StoryStatus = StoryStatus.DRAFT;

  @IsString()
  @IsOptional()
  public message: string;


}
