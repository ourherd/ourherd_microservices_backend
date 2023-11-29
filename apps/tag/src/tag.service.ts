import { Injectable, Logger } from "@nestjs/common";
import { TAG_MESSAGE_DB_RESPONSE } from "./constant/tag-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { CreateTagDto } from "./dto/create.tag.dto";
import { TagEntity } from "./entity/tag.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Database } from "@app/database";
import { IPagination, PaginationDto } from "@app/common";
import { TagDto } from "./dto/tag.dto";
import { ResponseTagsDto } from "./dto/response.tags.dto";
import { TagAddStoryDto } from "./dto/tag.add.story.dto";
import { StoryTagEntity } from "../../story/src/entity/tag/story.tag.entity";
import { StoryTagService } from "../../story/src/service/tag/story.tag.service";
import { v4 } from "uuid";

@Injectable()
export class TagService {

  private readonly logger = new Logger(TagService.name)
  private readonly LIMIT_APP_TAGS = 100;

  constructor(
    @InjectRepository(StoryTagEntity, Database.PRIMARY)
    private storyTagRepository: Repository<StoryTagEntity>,
    private readonly storyTagService: StoryTagService,
    @InjectRepository(TagEntity, Database.PRIMARY)  private tagRepository: Repository<TagEntity>) {}

  async create ( tagDto: CreateTagDto ): Promise<IServiceResponse<TagEntity>> {
    const tagExist = await this.findByName(tagDto);
    if ( tagExist ) {
       return await this.createTag(tagDto);
    } else {
      return {
        state: tagExist,
        data: null,
        message: TAG_MESSAGE_DB_RESPONSE.NAME_EXISTING
      }
    }
  }

  async findTagsAppAll({ limit, page }: PaginationDto): Promise<IServiceResponse<IPagination<TagEntity>>> {
    const tags = await this.tagRepository.find({
        take: limit ? limit: this.LIMIT_APP_TAGS,
        where: {
          verified : true,
          in_app: true
        },
        order: {
          order: "ASC"
        }
      },
    );

    return {
      state: true,
      data: {
        items: tags,
        limit: limit,
        total: tags.length
      }
    }
  }

  private async findByName ( tagDto: CreateTagDto | TagDto ) : Promise<boolean> {
    const tag = await this.tagRepository.findOneBy({ name: tagDto.name });
    return !tag;
  }

  public async createTag ( tagDto: CreateTagDto ): Promise<IServiceResponse<TagEntity>> {

    const tag = this.tagRepository.create(tagDto);
    const result = await this.tagRepository.save(tag);
    return {
      state: !!result,
      data: result,
      message: !!result ? TAG_MESSAGE_DB_RESPONSE.CREATED : TAG_MESSAGE_DB_RESPONSE.CREATED_FAILED
    }
  }

  public async createStoryTag ( story_id: string,  tags: TagDto[] ) {

    const { new_tags_dto, tag_story_exist } = await this.removeExistingTags( tags );
    let tagsEntity: TagEntity[] = [];
    let addTag: TagAddStoryDto;
    let tag;

    for ( const item of new_tags_dto) {
      tag = new TagEntity();
      tag.id = v4();
      tag.name = item.name;
      tagsEntity.push( tag );
      addTag = new TagAddStoryDto();
      addTag.id = tag.id;
      tag_story_exist.push(addTag)
    }

    if ( tagsEntity.length > 0 ) {
      let tagCreated = this.tagRepository.create(tagsEntity);
      await this.tagRepository.save(tagCreated);
    }
    this.logger.log('tag_story_exist '+ tag_story_exist);
    await this.storyTagService.addNewTagStory(story_id, tag_story_exist);
  }

  private async removeExistingTags( tags: TagDto[] ): Promise<ResponseTagsDto> {
    // Get names and create an array for them
    let names: string[] = [];
    for ( const item of tags) {
      names.push( item.name );
    }
    const tagsFound = await this.tagRepository.find({
      where: {
        name: In(names)
      }
    });
    this.logger.log('tags Found ' + JSON.stringify(tagsFound));
    let existingDto: TagAddStoryDto[] = [];
    let dto
    let pos;
    for (let i = 0; i < tagsFound.length; i++) {
      pos = tags.findIndex(el => el.name === tagsFound[i].name);
      if ( pos >= 0 ) {
        tags.splice(pos, 1);
        dto = new TagAddStoryDto();
        dto.id = tagsFound[i].id;
        existingDto.push(dto);
      }
    }
    this.logger.log('existing Dto Found ' + JSON.stringify(existingDto));
    return {
      new_tags_dto: tags,
      tag_story_exist: existingDto
    };
  }
}
