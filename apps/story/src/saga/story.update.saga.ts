import { Inject, Injectable, Logger } from "@nestjs/common";
import { StoryUpdateVideoDto } from "../dto/story/story.update.video.dto";
import { StoryUpdateTextFreeFormDto } from "../dto/story/story.update.text-freeform.dto";
import { StoryUpdateTextGuidedDto } from "../dto/story/story.update.text-guided.dto";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { UpdateResult } from "typeorm";
import { TagAddStoryDto } from "../../../tag/src/dto/tag.add.story.dto";
import { StoryTagService } from "../service/tag/story.tag.service";
import { StoryUpdateService } from "../service/story/story.update.service";
import { TagDto } from "../../../tag/src/dto/tag.dto";
import { ClientProxy } from "@nestjs/microservices";
import { TAG_STORY_MESSAGE_PATTERNS } from "../constant/tag-patterns.constants";
import { firstValueFrom } from "rxjs";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";

@Injectable()
export class StoryUpdateSaga {

  private logger = new Logger(StoryUpdateSaga.name);

  constructor(
    @Inject(RabbitServiceName.TAG) private tagClient: ClientProxy,
    private readonly storyUpdateService: StoryUpdateService,
    private readonly storyTagService: StoryTagService,
  ) {
  }

  /**
   * @remarks
   * @param StoryUpdateVideoDto | StoryUpdateTextFreeFormDto | StoryUpdateTextGuidedDto
   * @return IServiceResponse<UpdateResult>
   */

  public async updateContentStory(story_id: string, updateDto: StoryUpdateVideoDto | StoryUpdateTextFreeFormDto
    | StoryUpdateTextGuidedDto ): Promise<IServiceResponse<UpdateResult | null>> {

    await this.addTags(story_id, updateDto);
    await this.addNewTags(story_id, updateDto);

    const story = this.removeTagsAttrDto(updateDto);
    return await this.storyUpdateService.updateStory( story_id, story );
  }

  private async addTags ( story_id: string, updateDto: StoryUpdateVideoDto |
    StoryUpdateTextFreeFormDto | StoryUpdateTextGuidedDto ) {
    this.logger.log('Add tags Saga');
    const tags_ids:TagAddStoryDto[] = updateDto.tags;
    await this.storyTagService.addTagStory(story_id, tags_ids);
  }

  private async addNewTags ( story_id: string, updateDto: StoryUpdateVideoDto |
    StoryUpdateTextFreeFormDto | StoryUpdateTextGuidedDto ) {
    if (isEmptyOrNull(updateDto.new_tags)) return;

    this.logger.log('Add New tags Saga ' + JSON.stringify(updateDto.new_tags));
    const tags:TagDto[] = updateDto.new_tags;

    await firstValueFrom(
      this.tagClient.emit<IServiceResponse<UpdateResult>, { story_id: string, tags: TagDto[] }>(
        TAG_STORY_MESSAGE_PATTERNS.NEW_TAG_STORY,
        {
          story_id,
          tags
        }
      )
    );
  }

  private removeTagsAttrDto ( updateDto: StoryUpdateVideoDto |
    StoryUpdateTextFreeFormDto | StoryUpdateTextGuidedDto ) {
    delete updateDto["tags"];
    delete updateDto["new_tags"];

    return updateDto;
  }

/*
  public async addNewTagsToStory ( story_id: string, tags_ids: TagAddStoryDto[] ) {
    this.logger.log('addNewTagsToStory Add Story tags Saga ' + JSON.stringify(tags_ids));
    await this.storyTagService.addNewTagStory(story_id, tags_ids);
  }
*/

}
