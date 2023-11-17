import { Controller, Logger } from "@nestjs/common";
import { TagService } from "./tag.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TAG_MESSAGE_PATTERNS } from "./constant/tag-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { CreateTagDto } from "./dto/create.tag.dto";
import { TagEntity } from "./entity/tag.entity";

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  logger = new Logger(TagController.name);

  @MessagePattern(TAG_MESSAGE_PATTERNS.CREATE)
  async createTag (
    @Payload('tagDto') tagDto: CreateTagDto): Promise<IServiceResponse<TagEntity>> {
    return await this.tagService.create(tagDto);
  }

}
