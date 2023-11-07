import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { StorageResourceType, StorageResourceDriverType, StorageResourceBucket } from "../interface/storage-resource.interface";

export class BaseStorageResourceDto {
    // @ApiProperty()
    // @IsUUID()
    // id: string;
    //
    // @ApiProperty({
    //     enum: StorageResourceType
    // })
    // @IsEnum(StorageResourceType)
    // type: StorageResourceType;
    //
    // @ApiProperty({
    //     enum: StorageResourceDriverType,
    //     default: StorageResourceDriverType.S3
    // })
    // @IsEnum(StorageResourceDriverType)
    // driver: StorageResourceDriverType;
    //
    // @ApiProperty({
    //     enum: StorageResourceBucket,
    //     default: StorageResourceBucket.PRIMARY_BUCKET
    // })
    // @IsEnum(StorageResourceBucket)
    // bucket: StorageResourceBucket;
    //
    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // key: string;
}
