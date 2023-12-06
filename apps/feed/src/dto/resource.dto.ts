import { IsEnum } from "class-validator";
import { StorageResourceType } from "../../../storage/src/interface/storage-resource.interface";
import { Exclude } from "class-transformer";

export class ResourceDto {

  @Exclude()
  id: string;

  @Exclude()
  story_id: string;

  @IsEnum(StorageResourceType)
  resource_type: StorageResourceType;

  has_captions_included: boolean;

  media_captions_path: string;

  media_resource_path: string;

  @Exclude()
  readonly created_at: string;

  @Exclude()
  readonly updated_at: string;

  @Exclude()
  readonly deleted_at: string;

  @Exclude()
  readonly driver: string;

}
