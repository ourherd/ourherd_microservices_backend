import { Column, Entity, ManyToMany, JoinTable } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { StoryMedium, StorySourceType, StoryStatus, StoryType } from "../../constant/story.enum";
import { TagEntity } from "../../../../tag/src/entity/tag.entity";

@Entity({
  name: 'stories'
})
export class StoryEntity extends AbstractEntity {

  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: true })
  title: string;

  @Column({
    type: "enum",
    enum: StoryStatus,
    default: StoryStatus.DRAFT
  })
  story_status: StoryStatus;

  @Column({
    type: "enum",
    enum: StoryType,
  })
  story_type: StoryType;

  @Column({
    type: "enum",
    enum: StoryMedium,
  })
  story_medium: StoryMedium;

  @Column({ default: false, nullable: true })
  has_hero_statement: boolean;

  @Column({ nullable: true })
  hero_statement: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  content_1: string;

  @Column({ nullable: true })
  content_2: string;

  @Column({ nullable: true })
  content_3: string;

  @Column({ nullable: true })
  content_4: string;

  @Column({ nullable: true, default: 0 })
  order: number;

  @Column({ nullable: true, default: 0 })
  ranking: number;

  @Column({
    type: "enum",
    enum: StorySourceType,
    default: StorySourceType.OURHERD_APP
  })
  source: StorySourceType = StorySourceType.OURHERD_APP;

  @Column({ nullable: true, default: 0 })
  revision: number;

  // Add many to many relationship stories and tags
  @ManyToMany(
  () => TagEntity,
  tag => tag.stories,
  {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
    @JoinTable({
      name: 'story_tags',
      joinColumn: {
        name: 'story_id',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'tag_id',
        referencedColumnName: 'id',
      },
    })
    tags?: TagEntity[];

}
