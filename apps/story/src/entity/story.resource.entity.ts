import { Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";

@Entity({
  name: 'story_resources'
})
export class StoryResourceEntity extends AbstractEntity {

}
