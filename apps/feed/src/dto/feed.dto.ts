import { IsArray, IsOptional } from "class-validator";
import { StoryDto } from "./story.dto";
import { IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "@app/common";

export class FeedDto extends IntersectionType(PaginationDto) {

  @IsArray()
  @IsOptional()
  public stories: StoryDto[];

}
