import { Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";

@Entity({
  name: 'story_tags'
})
export class StoryTagEntity extends AbstractEntity {

}
