import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StoryStatus } from "../../../story/src/constant/story.enum";
import { MyStoryDto } from "../dto/my.story.dto";
import { plainToInstance } from "class-transformer";
import { MyStoriesTagService } from "./my.stories.tag.service";
import { MyStoriesSettingService } from "./my.stories.setting.service";

@Injectable()
export class MyStoriesService {

  private readonly logger = new Logger(MyStoriesService.name);
  constructor(
    private readonly tagService: MyStoriesTagService,
    private readonly settingService: MyStoriesSettingService,
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
  ){}

  public async getInProgressStories (member_id: string): Promise<MyStoryDto[]> {

    const entities = await this.storyRepository.createQueryBuilder('progress')
      .where('progress.story_status !=:status_published' , { status_published: StoryStatus.PUBLISHED })
      //.andWhere('progress.story_status !=:status_archived' , { status_archived: StoryStatus.ARCHIVED })
      .andWhere('progress.member_id =:member_id' , { member_id: member_id })
      .orderBy('progress.updated_at', 'ASC')
      .getMany();
    return await this.getMyStoriesContent(entities);

  }

  public async getPublishedStories (member_id: string): Promise<MyStoryDto[]> {

    const entities = await this.storyRepository.createQueryBuilder('progress')
      .where('progress.story_status =:status_published' , { status_published: StoryStatus.PUBLISHED })
      .andWhere('progress.member_id =:member_id' , { member_id: member_id })
      .orderBy('progress.updated_at', 'ASC')
      .getMany();

    return await this.getMyStoriesContent(entities);

  }

  // Get content my stories
  async getMyStoriesContent (entities: StoryEntity[]): Promise<MyStoryDto[]> {

    const stories = plainToInstance(MyStoryDto, entities);
    let dtos: MyStoryDto[] = [];
    for ( let dto of stories ) {
      dto = await this.tagService.getTagsByMyStory(dto)
      dto = await this.settingService.getSettingByMyStory(dto)
      dtos.push( dto );
    }
    return dtos;
  }






}
