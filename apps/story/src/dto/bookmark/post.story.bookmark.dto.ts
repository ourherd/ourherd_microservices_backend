import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class PostStoryBookmarkDto {

  @Exclude()
  public member_id: string;

  @ApiProperty({
    description: "Story ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @IsUUID()
  @IsString()
  public story_id: string;
}
