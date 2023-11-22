import { Injectable, Logger } from "@nestjs/common";
import { TAG_MESSAGE_DB_RESPONSE } from "./constant/tag-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { CreateTagDto } from "./dto/create.tag.dto";
import { TagEntity } from "./entity/tag.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IPagination, PaginationDto } from "@app/common";

@Injectable()
export class TagService {

  private readonly logger = new Logger(TagService.name)
  private readonly LIMIT_APP_TAGS = 100;

  constructor(
    @InjectRepository(TagEntity, Database.PRIMARY)  private tagRepository: Repository<TagEntity>) {}

  async create ( tagDto: CreateTagDto ): Promise<IServiceResponse<TagEntity>> {
    const tagExist = await this.findByName(tagDto);
    if ( tagExist.state ) {
       return await this.createTag(tagDto);
    }
    return tagExist;
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
