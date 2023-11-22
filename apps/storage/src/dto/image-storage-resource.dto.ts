import { BaseStorageResourceDto } from "./base-storage-resource.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StorageResourceType } from "../interface/storage-resource.interface";
import { IsEnum } from "class-validator";

export class ImageStorageResourceDto extends BaseStorageResourceDto {

  @ApiProperty({
    enum: StorageResourceType,
    default: StorageResourceType.STORY_IMAGE
  })
  @IsEnum(StorageResourceType)
  resource_type: StorageResourceType = StorageResourceType.STORY_IMAGE;

}
