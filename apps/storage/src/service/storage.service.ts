import { IServiceResponse } from "@app/rabbit";
import { Injectable, Logger } from "@nestjs/common";
import { CreateStorageResourceDto } from "../dto/create-storage-resource.dto";
import { StorageResourceEntity } from "../entity/storage-resource.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Database } from "@app/database";
import { ResourceS3AwsService } from "./driver/resource-s3-aws-service";
import { STORAGE_MESSAGE_DB_RESPONSE } from "../constant/storage-patterns.constant";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {

  private readonly logger = new Logger(StorageService.name);

  constructor(
    @InjectRepository(StorageResourceEntity, Database.PRIMARY)
      private storageRepository: Repository<StorageResourceEntity>,
    private s3Service: ResourceS3AwsService,
    private configService: ConfigService) { }

  async upload(
    storageDto: CreateStorageResourceDto,
    story_resource: Express.Multer.File
  ): Promise<IServiceResponse<StorageResourceEntity>> {

    try {

      let result: StorageResourceEntity;
      const storageResourceExist = await this.storageRepository.findOneBy({ story_id: storageDto.story_id })

      if (!storageResourceExist) {

        const resource = this.storageRepository.create(storageDto);
        const { state, data: { key } } = await this.s3Service.upload(storageDto, story_resource)

        if (state === true) {
          resource.media_resource_path = key;
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

}
