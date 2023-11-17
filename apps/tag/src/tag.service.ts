import { Injectable, Logger } from "@nestjs/common";
import { TAG_SERVICE } from "./constant/tag-patterns.constants";
import { PostReactionDto } from "../../story/src/dto/reaction/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { ReactionEntity } from "../../story/src/entity/reaction/reaction.entity";
import { TAG_MESSAGE_DB_RESPONSE } from "./constant/tag-patterns.constants";
import { CreateTagDto } from "./dto/create.tag.dto";
import { TagEntity } from "./entity/tag.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";

@Injectable()
export class TagService {

  private readonly logger = new Logger(TagService.name)
  constructor(
    @InjectRepository(TagEntity, Database.PRIMARY)  private tagRepository: Repository<TagEntity>) {}

  async create ( tagDto: CreateTagDto ): Promise<IServiceResponse<TagEntity>> {
    const tagExist = await this.findByName(tagDto);
    if ( tagExist.state ) {
       return await this.createTag(tagDto);
    }
    return tagExist;
  }

  private async findByName ( tagDto: CreateTagDto ) {
    const tag = await this.tagRepository.findOneBy({ name: tagDto.name });
    return {
      state: !tag,
      data: null,
      message: TAG_MESSAGE_DB_RESPONSE.NAME_EXISTING
    }
  }

  private async createTag ( tagDto: CreateTagDto ): Promise<IServiceResponse<TagEntity>> {
    const tag = await this.tagRepository.create(tagDto);
    const result = await this.tagRepository.save(tag);
    return {
      state: !!result,
      data: result,
      message: !!result ? TAG_MESSAGE_DB_RESPONSE.CREATED : TAG_MESSAGE_DB_RESPONSE.CREATED_FAILED
    }
  }

}
