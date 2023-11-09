import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { SURVEY_STATUS, SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { IsEnum } from "class-validator";

@Entity({
  name: 'survey_member_instances'
})

export class SurveyMemberInstanceEntity extends AbstractEntity {

  @Column({ nullable: false })
  survey_id: string;

  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ 
    nullable: true, 
    default: false
  })
  consent: boolean;

  @Column({ 
    nullable: true, 
    default: SURVEY_STATUS.INCOMPLETE
  })
  status: string;
  
  @Column({ 
    nullable: false, 
  })
  @IsEnum(SURVEY_TYPE)
  type: string;

}
