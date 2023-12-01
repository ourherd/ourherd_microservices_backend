import { IsEnum, IsString } from "class-validator";
import { StorageResourceType } from "../../../storage/src/interface/storage-resource.interface";

export class ResourceDto {

  @IsString()
  readonly id: string;

  @IsEnum(StorageResourceType)
  resource_type: StorageResourceType;

  @IsString()
  has_captions_included: boolean;

  @IsString()
  media_captions_path: string;

  @IsString()
  media_resource_path: string;

}
