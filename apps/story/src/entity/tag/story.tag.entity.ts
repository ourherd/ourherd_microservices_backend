import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { StoryEntity } from "../story/story.entity";
import { TagEntity } from "../../../../tag/src/entity/tag.entity";

@Entity({
  name: 'story_tags'
})
export class StoryTagEntity extends AbstractEntity {

  @PrimaryColumn({ name: 'story_id' })
  story_id: string;

  @PrimaryColumn({ name: 'tag_id' })
  tag_id: string;

  @ManyToOne(
    () => StoryEntity,
    story => story.tags,
    { onDelete: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
  stories: StoryEntity[];

  @ManyToOne(
    () => TagEntity,
    tag => tag.stories,
    { onDelete: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tags: TagEntity[];

}
