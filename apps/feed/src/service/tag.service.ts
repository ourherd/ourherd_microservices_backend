import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { TagEntity } from "../../../tag/src/entity/tag.entity";
import { Logger } from "@nestjs/common";
import { StoryDto } from "../dto/story.dto";
import { StoryTagEntity } from "../../../story/src/entity/tag/story.tag.entity";
import { plainToInstance } from "class-transformer";
import { TagDto } from "../dto/tag.dto";

export class TagService {

  private readonly logger = new Logger(TagService.name);
  private readonly TAG_LIMIT = 5;

  constructor(
    @InjectRepository(TagEntity, Database.PRIMARY)  private tagRepository: Repository<TagEntity>
  ) {}

  async getTagsByStory (dto: StoryDto) :  Promise<StoryDto> {

    const tags =  await this.tagRepository.createQueryBuilder('t')
      .leftJoinAndSelect(StoryTagEntity, 'st', 't.id = st.tag_id')
      .andWhere('st.story_id = :story_id', { story_id: dto.id })
      .limit(this.TAG_LIMIT)
      .getMany();

    this.logger.log('Tags By Story ' + dto.id );
    const storyTags = plainToInstance(TagDto, tags);
    dto.tags = storyTags;

    return dto;
  }

}
