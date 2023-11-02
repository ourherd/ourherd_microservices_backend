import { ApiProperty } from "@nestjs/swagger";
import { BaseStorageResourceDto } from "./base-storage-resource.dto";
import { IsEnum, IsString, IsUUID, Allow } from "class-validator";
import { StorageResourceDriverType, StorageResourceType } from "../interface/storage-resource.interface";
import { Transform } from "class-transformer";
import { v4 } from "uuid";

export class CreateStorageResourceDto extends BaseStorageResourceDto {

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
    type: StorageResourceType;

    @ApiProperty({
        enum: StorageResourceDriverType,
        default: StorageResourceDriverType.S3
    })
    @IsEnum(StorageResourceDriverType)
    driver: StorageResourceDriverType = StorageResourceDriverType.S3;

    @ApiProperty({
        type: 'string',
        format: 'binary'
    })
    @Allow()
    file: Express.Multer.File;
}
