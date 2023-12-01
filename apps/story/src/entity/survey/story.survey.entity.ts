import { AbstractEntity } from "@app/database/base/base.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

@Entity({
  name: 'story_survey'
})

export class StorySurveyEntity extends AbstractEntity {

  @ApiProperty()
  @Column({ nullable: false })
  member_id: string;

  @ApiProperty()
  @Column({ nullable: false })
  story_id: string;

  @ApiProperty()
  @Column({ nullable: false })
  survey_instance_id: string;

  @ApiProperty()
  @Column({ nullable: true, default: 0 })
  survey_score: number;

}
