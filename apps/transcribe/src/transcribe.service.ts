import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StorageResourceEntity } from "../../storage/src/entity/storage-resource.entity";

@Injectable()
export class TranscribeService {

  constructor(
    @InjectRepository(StorageResourceEntity, Database.PRIMARY)
    private storageResourceEntity: Repository<StorageResourceEntity>,
    ) {}

  async
  
  //
  async getStoryResource(story_id: string): Promise<StorageResourceEntity> {
    return this.storageResourceEntity.findOneBy({
      story_id: story_id
    });
  }
}
