import { Controller, Logger } from "@nestjs/common";
import { TagService } from "./tag.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TAG_MESSAGE_PATTERNS } from "./constant/tag-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { CreateTagDto } from "./dto/create.tag.dto";
import { TagEntity } from "./entity/tag.entity";
import { IPagination, PaginationDto } from "@app/common";
import { TAG_STORY_MESSAGE_PATTERNS } from "../../story/src/constant/tag-patterns.constants";
import { TagDto } from "./dto/tag.dto";

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  logger = new Logger(TagController.name);

  @MessagePattern(TAG_MESSAGE_PATTERNS.CREATE)
  async createTag (
    @Payload('tagDto') tagDto: CreateTagDto): Promise<IServiceResponse<TagEntity>> {
    return await this.tagService.create(tagDto);
  }

  @MessagePattern(TAG_STORY_MESSAGE_PATTERNS.NEW_TAG_STORY)
  async createStoryTag (
    @Payload('story_id') story_id: string,
    @Payload('tags') tags: TagDto[]) {
    await this.tagService.createStoryTag(story_id, tags);
  }

  @MessagePattern(TAG_MESSAGE_PATTERNS.APP)
  async findAll(@Payload() paginationDto: PaginationDto):
    Promise<IServiceResponse<IPagination<TagEntity>>> {
    return await this.tagService.findTagsAppAll(paginationDto);
  }

}
