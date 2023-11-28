import { TagDto } from "./tag.dto";
import { TagAddStoryDto } from "./tag.add.story.dto";

export class ResponseTagsDto {

  public new_tags_dto: TagDto[];
  public tag_story_exist: TagAddStoryDto[];

}
