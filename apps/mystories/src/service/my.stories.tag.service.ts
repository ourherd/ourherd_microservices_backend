import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { TagEntity } from "../../../tag/src/entity/tag.entity";
import { Logger } from "@nestjs/common";
import { MyStoryDto } from "../dto/my.story.dto";
import { StoryTagEntity } from "../../../story/src/entity/tag/story.tag.entity";
import { plainToInstance } from "class-transformer";
import { TagDto } from "../dto/tag.dto";

export class MyStoriesTagService {

  private readonly logger = new Logger(MyStoriesTagService.name);
  private readonly TAG_LIMIT = 5;

  constructor(
    @InjectRepository(TagEntity, Database.PRIMARY)  private tagRepository: Repository<TagEntity>
  ) {}

  async getTagsByMyStory (dto: MyStoryDto) :  Promise<MyStoryDto> {

    const tags =  await this.tagRepository.createQueryBuilder('t')
      .leftJoinAndSelect(StoryTagEntity, 'st', 't.id = st.tag_id')
      .andWhere('st.story_id = :story_id', { story_id: dto.id })
      .limit(this.TAG_LIMIT)
      .getMany();

    dto.tags = plainToInstance(TagDto, tags);

    return dto;
  }

}
