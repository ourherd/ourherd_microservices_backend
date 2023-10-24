import { Column, Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { StorySourceType, StoryStatus, StoryType } from "./story.enum";
import { isUUID } from "class-validator";

@Entity({
  name: 'stories'
})
export class StoryEntity extends AbstractEntity {

  @Column({ nullable: false })
  @isUUID()
  member_id: string;

  @Column({ nullable: true })
  title: string;

  @Column({
    type: "enum",
    enum: StoryStatus,
    default: StoryStatus.DRAFT
  })
  status: StoryStatus;

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

  @Column({
    type: "enum",
    enum: StoryType
  })
  story_type: StoryType;

  @Column({ nullable: true, default: 0 })
  order: number;

  @Column({ nullable: true, default: 0 })
  ranking: number;

  @Column({
    type: "enum",
    enum: StorySourceType,
    default: StorySourceType.OURHERD
  })
  source: StorySourceType = StorySourceType.OURHERD;

  @Column({ nullable: true, default: 0 })
  revision: number;

}
