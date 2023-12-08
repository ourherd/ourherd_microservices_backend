import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StorageResourceEntity } from "../../../storage/src/entity/storage-resource.entity";
import { MyStoryDto } from "../dto/my.story.dto";
import { plainToInstance } from "class-transformer";
import { MyStoryResourceDto } from "../dto/my.story.resource.dto";

@Injectable()
export class MyStoriesResourceService {

  private readonly logger = new Logger(MyStoriesResourceService.name);

  constructor(
    @InjectRepository(StorageResourceEntity, Database.PRIMARY)
            private storageEntity: Repository<StorageResourceEntity>,
  ) {}

  async getStorageResource (dto: MyStoryDto): Promise<MyStoryDto> {

    const resource = await this.storageEntity.findOneBy({ story_id: dto.id  });
    const dtoResource = plainToInstance(MyStoryResourceDto, resource);
    dto.resource = dtoResource;

    return dto;
  }

}
