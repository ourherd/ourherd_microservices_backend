import { Controller } from "@nestjs/common";
import { StorageService } from "./service/storage.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { STORAGE_MESSAGE_PATTERNS } from "./constant/storage-patterns.constant";
import { IServiceResponse } from "@app/rabbit";
import { StorageResourceEntity } from "./entity/storage-resource.entity";
import { CreateStorageResourceDto } from "./dto/create-storage-resource.dto";

@Controller()
export class StorageController {
  constructor(
    private storageService: StorageService
  ) { }

  @MessagePattern(STORAGE_MESSAGE_PATTERNS.CREATE)
  async createStorageFile(
    @Payload('storageDto') storageDto: CreateStorageResourceDto, ot_file: Buffer):
    Promise<IServiceResponse<StorageResourceEntity>> {

    return await this.storageService.create(storageDto, ot_file);
  }
}
