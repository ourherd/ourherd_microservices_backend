import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StoryTagEntity } from "../../entity/tag/story.tag.entity";
import { TagAddStoryDto } from "../../../../tag/src/dto/tag.add.story.dto";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";
import { TAG_STORY_MESSAGE_DB_RESPONSE } from "../../constant/tag-patterns.constants";
import { IServiceResponse } from "@app/rabbit";

@Injectable()
export class StoryTagService {

  private readonly logger = new Logger(StoryTagService.name)
  constructor(
    @InjectRepository(StoryTagEntity, Database.PRIMARY)
    private storyTagRepository: Repository<StoryTagEntity>) {}

  // Existing one
  async addTagStory( story_id: string, tags: TagAddStoryDto[] ) {
    const remove = await this.removeTagsByStory(story_id);
    if ( remove.affected !== undefined) {
      await this.addNewTagStory(story_id, tags);
    }
  }

  // Create new
  async addNewTagStory ( story_id: string, tags: TagAddStoryDto[] ) {

    let tags_story: StoryTagEntity[] = [];
    let tagStory;

    tags.forEach(tag => {
      tagStory = new StoryTagEntity();
      tagStory.story_id = story_id;
      tagStory.tag_id = tag.id;
      this.logger.log('Tags ID to Story -> ' + JSON.stringify(tag.id, null, 2));
      tags_story.push( tagStory );
    });

    try {
      const tags_story_entity = this.storyTagRepository.create(tags_story);
      this.logger.log('ssss Adding Tags to Story -> ' + JSON.stringify(tags_story_entity));
      await this.storyTagRepository.save(tags_story_entity);

    } catch (e) {
      this.logger.error('Error Adding Tags to Story -> ' + JSON.stringify(e));
    }
  }

  async removeTagsByStory ( story_id: string ): Promise<DeleteResult> {
    this.logger.log('Tags story ID remove -> ' + JSON.stringify(story_id));
    return await this.storyTagRepository.delete({ story_id: story_id });
  }

  async tagsByStoryID ( story_id: string ): Promise<IServiceResponse<StoryTagEntity>>  {
    const tags = await this.storyTagRepository.findBy({ story_id });
    return {
      state: !!tags,
      data: tags.length > 0 ? tags[0]: null,
      message: !!tags ? TAG_STORY_MESSAGE_DB_RESPONSE.FOUND : TAG_STORY_MESSAGE_DB_RESPONSE.NOT_FOUND
    }

  }
}
