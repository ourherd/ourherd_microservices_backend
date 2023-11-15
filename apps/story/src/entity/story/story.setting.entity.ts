import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { IsEnum } from "class-validator";
import { StoryVisibility } from "../../constant/story.enum";
import { StoryEntity } from "./story.entity";

@Entity({
  name: 'story_settings'
})
export class StorySettingEntity extends AbstractEntity {
  
  @ManyToOne(() => StoryEntity)
  @JoinColumn({ name: "story_id" })
  story: StoryEntity;
  
  @Column({ 
    nullable: false, 
    default: StoryVisibility.PUBLIC
  })
  @IsEnum(StoryVisibility)
  visibility: string;
  
  @Column({ 
    nullable: false,
    default: false
  })
  is_shareable: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_name: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_location: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_gender: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_age: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_batyr_instragram: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_batyr_tiktok: boolean;
  
  @Column({ 
    nullable: false,
    default: false
  })
  share_contacted: boolean;
  
}
