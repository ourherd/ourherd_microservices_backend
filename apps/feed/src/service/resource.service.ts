import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StorageResourceEntity } from "../../../storage/src/entity/storage-resource.entity";
import { StoryDto } from "../dto/story.dto";
import { plainToInstance } from "class-transformer";
import { ResourceDto } from "../dto/resource.dto";

@Injectable()
export class ResourceService {

  private readonly logger = new Logger(ResourceService.name);

  constructor(
    @InjectRepository(StorageResourceEntity, Database.PRIMARY)  private storageEntity: Repository<StorageResourceEntity>,
  ) {}

  async getStorageResource (dto: StoryDto): Promise<StoryDto> {

    const resource = await this.storageEntity.findOneBy({ story_id: dto.id  });
    const dtoResource = plainToInstance(ResourceDto, resource);
    dto.resource = dtoResource;
    this.logger.log('Resource By Story->' + dto.id + ' Resource ID->' + JSON.stringify(resource.id, null, 2));

    return dto;
  }

}
