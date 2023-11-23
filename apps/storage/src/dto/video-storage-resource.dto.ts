import { BaseStorageResourceDto } from "./base-storage-resource.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StorageResourceType } from "../interface/storage-resource.interface";
import { IsEnum } from "class-validator";

export class VideoStorageResourceDto extends  BaseStorageResourceDto {
  
  @ApiProperty({
    enum: StorageResourceType,
    default: StorageResourceType.STORY_VIDEO
  })
  @IsEnum(StorageResourceType)
  resource_type: StorageResourceType = StorageResourceType.STORY_VIDEO;

}
