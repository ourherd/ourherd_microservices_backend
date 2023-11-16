import { IsNotEmpty } from "class-validator";
import { StoryVisibility } from "../../constant/story.enum";
import { StoryEntity } from "../../entity/story/story.entity";


export class StorySettingDto {
  
  @IsNotEmpty()
  story: StoryEntity;
  
  visibility: StoryVisibility;
  
  is_shareable: boolean;
  
  share_name: boolean;
  
  share_location: boolean;
  
  share_gender: boolean;
  
  share_age: boolean;
  
  share_batyr_instragram: boolean;
  
  share_batyr_tiktok: boolean;
  
  share_contacted: boolean;
  
}
