import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { SURVEY_STATIC_STATUS, SURVEY_TYPE } from "../constant/survey-patterns.constants";
import { IsEnum } from "class-validator";

@Entity({
  name: 'surveys'
})

export class SurveyEntity extends AbstractEntity {

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  
  @Column({ nullable: true })
  version: number;
  
  @Column({ nullable: false })
  @IsEnum(SURVEY_TYPE)
  type: string;
  
  @Column({ nullable: false })
  @IsEnum(SURVEY_STATIC_STATUS)
  status: string;
  
  @Column({ 
    nullable: true,
    type: "jsonb"
  })
  document_file: string;
  
  @Column({ nullable: true })
  document_url: string;

}
