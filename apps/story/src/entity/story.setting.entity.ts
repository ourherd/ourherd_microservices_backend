import { Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";

@Entity({
  name: 'story_settings'
})
export class StorySettingEntity extends AbstractEntity {

}
