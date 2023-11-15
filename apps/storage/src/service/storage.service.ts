import _ from 'lodash';
import { IServiceResponse } from "@app/rabbit";
import { Injectable } from "@nestjs/common";
import { CreateStorageResourceDto } from "../dto/create-storage-resource.dto";
import { StorageResourceEntity } from "../entity/storage-resource.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Database } from "@app/database";
import { ResourceS3AwsService } from "./driver/resource-s3-aws-service";

@Injectable()
export class StorageService {
    constructor(
        @InjectRepository(StorageResourceEntity, Database.PRIMARY)
        private storageRepository: Repository<StorageResourceEntity>,
        private s3Service: ResourceS3AwsService ) { }

    async upload(
      storageDto: CreateStorageResourceDto,
      story_resource: Express.Multer.File
   ): Promise<IServiceResponse<StorageResourceEntity>> {

      let result: StorageResourceEntity;
      const resource = this.storageRepository.create(_.omit(storageDto, ['file']));

      const { state, data: { key } } = await this.s3Service.upload(storageDto, story_resource)

      if ( state === true ) {
          resource.media_resource_path = key;
          resource.resource_type = storageDto.type;
          result = await this.storageRepository.save(resource);
      }

      return {
        state: !!result,
        data: result
      };

    }

}
