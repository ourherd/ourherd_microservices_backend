import { Column, Entity, ManyToMany } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";

@Entity({
  name: 'tags'
})

export class TagEntity extends AbstractEntity {

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: true,
    default: false
  })
  verified: boolean;

  @Column({ nullable: true })
  order: number;

  @ManyToMany(
    () => StoryEntity,
    story => story.tags,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  stories?: StoryEntity[];

}
