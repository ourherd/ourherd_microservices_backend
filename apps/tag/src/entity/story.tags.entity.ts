import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { TagEntity } from "./tag.entity";

@Entity({
  name: 'story_tags'
})

export class StoryTagsEntity extends AbstractEntity {

  @PrimaryColumn({ name: 'story_id' })
  story_id: number;

  @PrimaryColumn({ name: 'tag_id' })
  tag_id: number;

  @ManyToOne(
    () => StoryEntity,
    story => story.tags,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
  stories: StoryEntity[];

  @ManyToOne(
    () => TagEntity,
    tag => tag.stories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tags: TagEntity[];

}
