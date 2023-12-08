import { IsEnum } from "class-validator";
import { StorageResourceType } from "../../../storage/src/interface/storage-resource.interface";
import { Exclude } from "class-transformer";
import { BaseAbstractDto } from "./base.abstract.dto";

export class MyStoryResourceDto extends BaseAbstractDto {

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
  readonly driver: string;

}
