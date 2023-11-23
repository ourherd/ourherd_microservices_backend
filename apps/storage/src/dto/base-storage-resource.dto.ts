import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { StorageResourceDriverType, StorageResourceType } from "../interface/storage-resource.interface";
import { Transform } from "class-transformer";
import { v4 } from "uuid";

export class BaseStorageResourceDto {

  @ApiProperty()
  @IsUUID()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiProperty()
  @IsUUID()
  story_id: string;

  @ApiProperty({
    enum: StorageResourceType
  })
  @IsEnum(StorageResourceType)
  resource_type: StorageResourceType;

  @ApiProperty({
    enum: StorageResourceDriverType,
    default: StorageResourceDriverType.S3
  })
  @IsEnum(StorageResourceDriverType)
  driver: StorageResourceDriverType = StorageResourceDriverType.S3;

}
