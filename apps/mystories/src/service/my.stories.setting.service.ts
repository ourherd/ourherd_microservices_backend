import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StorySettingEntity } from "../../../story/src/entity/story/story.setting.entity";
import { MyStoryDto } from "../dto/my.story.dto";
import { plainToInstance } from "class-transformer";
import { MyStoryMemberDto } from "../dto/my.story.member.dto";

export class MyStoriesSettingService {

  private readonly logger = new Logger(MyStoriesSettingService.name);

  constructor(
    @InjectRepository(StorySettingEntity, Database.PRIMARY) private storySettingRepository: Repository<StorySettingEntity>,
  ) {}

  async getSettingByMyStory (dto: MyStoryDto) : Promise<MyStoryDto> {

    const settings =  await this.storySettingRepository.createQueryBuilder('setting')
      .leftJoinAndSelect(StoryEntity, 'story', 'setting.story_id = story.id')
      .andWhere('story.id = :story_id', { story_id: dto.id })
      .getOne();

    let storyMemberDto = plainToInstance(MyStoryMemberDto, settings);
    dto.settings = storyMemberDto;

    return dto;

  }

}
