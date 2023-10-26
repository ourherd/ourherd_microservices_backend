import { Entity, OneToOne, JoinColumn, Column } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'story_bookmarks'
})
export class StoryBookmarkEntity extends AbstractEntity {

  @ApiProperty()
  @Column({ nullable: false })
  member_id: string;

  @ApiProperty()
  @Column({ nullable: false })
  story_id: string;

}
