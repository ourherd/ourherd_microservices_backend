import { IServiceResponse } from "@app/rabbit";
import { Injectable, Logger } from "@nestjs/common";
import { CreateStorageResourceDto } from "../dto/create-storage-resource.dto";
import { StorageResourceEntity } from "../entity/storage-resource.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Database } from "@app/database";
import { ResourceS3AwsService } from "./driver/resource-s3-aws-service";
import { STORAGE_MESSAGE_DB_RESPONSE } from "../constant/storage-patterns.constant";

@Injectable()
export class StorageService {

  private readonly logger = new Logger(StorageService.name);

  constructor(
    @InjectRepository(StorageResourceEntity, Database.PRIMARY) private storageRepository: Repository<StorageResourceEntity>,
    private s3Service: ResourceS3AwsService) { }

  async upload(
    storageDto: CreateStorageResourceDto,
    story_resource: Express.Multer.File
  ): Promise<IServiceResponse<StorageResourceEntity>> {

    try {

      let result: StorageResourceEntity;
      const storageResourceExist = await this.resourceByStoryId(storageDto.story_id);

      if (!storageResourceExist) {

        const resource = this.storageRepository.create(storageDto);
        const { state, data: { key } } = await this.s3Service.upload(storageDto, story_resource)

        if (state === true) {
          resource.media_original_resource_path = key;
          resource.resource_type = storageDto.resource_type;
          result = await this.storageRepository.save(resource);
        }
      } else {

        if (storageDto.resource_type != storageResourceExist.resource_type) {
          return {
            state: false,
            data: null,
            message: STORAGE_MESSAGE_DB_RESPONSE.WRONG_UPLOAD
          };
        }

        Object.assign(storageDto, storageResourceExist)
        const resource = this.storageRepository.create(storageDto);
        const { state, data: { key } } = await this.s3Service.upload(storageDto, story_resource)

        await this.storageRepository.update({
          story_id: storageResourceExist.story_id
        }, resource)
      }

      //TODO call function to go to @EventPattern(MEDIA_MESSAGE_PATTERNS.CREATE_IMAGE)
      // ADD to the module MEDIA
      //TODO this function depending on resource_type if its IMAGE
      //TODO this function depending on resource_type if its VIDEO
      return {
        state: !!result,
        data: result
      };

    } catch (error) {
      this.logger.error("UPLOAD ERROR: ", error)

      return {
        state: false,
        data: error
      };
    }
  }

  async resourceByStoryId (story_id:string) : Promise<StorageResourceEntity> {
    return await this.storageRepository.findOneBy({ story_id });
  }

  async resourceExist (story_id: string) : Promise<IServiceResponse<StorageResourceEntity>> {
    const resource =  await this.resourceByStoryId(story_id);
    return {
      state: !!resource.media_resource_path,
      data: resource
    }
  }

}
