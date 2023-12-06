import { StoryDto } from "../dto/story.dto";
import { StoryStatus } from "../../../story/src/constant/story.enum";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IStoriesResponse } from "../interface/stories.response";
import { TagService } from "./tag.service";
import { ReactionService } from "./reaction.service";
import { ResourceService } from "./resource.service";
import { SettingService } from "./setting.service";
import { BookmarkService } from "./bookmark.service";

export class StoryService {

  private readonly logger = new Logger(StoryService.name);
  private readonly FEED_LIMIT = 10;
  private readonly SAVED_STORIES_LIMIT = 10;

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
    private tagService: TagService,
    private reactionService: ReactionService,
    private bookmarkService: BookmarkService,
    private resourceService: ResourceService,
    private settingService: SettingService,
  ) {}

  // Get Stories for the feed
  async getFeedStories (member_id: string, page: number):  Promise<IStoriesResponse<StoryDto[], number>> {

    const entities = await this.storyRepository.createQueryBuilder('feed')
      .where('feed.story_status= :story_status' , { story_status: StoryStatus.PUBLISHED })
      .take(this.FEED_LIMIT - 1)
      .skip((page - 1) * this.FEED_LIMIT )
      .getMany();

    const stories = await this.getStoriesContent(member_id, entities);
    const total = await this.storyRepository.count({ where: { story_status: StoryStatus.PUBLISHED } });

    return { stories, total }
  }

  // Get Saved Stories
  async getSavedStories (member_id: string, page: number):  Promise<IStoriesResponse<StoryDto[], number>> {
    // get all ids for the saved stories
    let ids = await this.bookmarkService.getBookmarkIds(member_id);
    const entities = await this.storyRepository.createQueryBuilder('feed')
      .where('feed.story_status= :story_status' , { story_status: StoryStatus.PUBLISHED })
      .andWhere('feed.id IN (:...ids)', {ids: ids})
      .take(this.SAVED_STORIES_LIMIT - 1)
      .skip((page - 1) * this.SAVED_STORIES_LIMIT )
      .getMany();

    const stories = await this.getStoriesContent(member_id, entities);
    return { stories, total: ids.length }
  }

  // Get content
  async getStoriesContent (member_id: string, entities: StoryEntity[]): Promise<StoryDto[]> {

    const stories = plainToInstance(StoryDto, entities);

    let storiesDto: StoryDto[] = [];
    for ( let dto of stories ) {
      dto = await this.tagService.getTagsByStory(dto)
      dto = await this.resourceService.getStorageResource(dto)
      dto = await this.settingService.getSettingByStory(dto)
      dto = await this.reactionService.getReactionStoryByMember(member_id, dto)
      dto = await this.bookmarkService.getBookmarkByStory(member_id, dto)
      storiesDto.push( dto );
    }
    return storiesDto;
  }

}
