import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { SURVEY_STATUS } from "../constant/survey-patterns.constants";
import { integer } from "aws-sdk/clients/cloudfront";

@Entity({
  name: 'survey_final_responses'
})

export class SurveyFinalResponseEntity extends AbstractEntity {

  @Column({ nullable: false })
  survey_member_instance_id: string;

  @Column({ nullable: false })
  question_number: string;

  @Column({ nullable: true })
  question_text: string;

  @Column({ nullable: true })
  question_response: string;

  @Column({ nullable: false })
  question_response_scale: number;



  // @OneToMany(type => AccountDeviceEntity, account => account.id)
  // @JoinColumn({name: "account_id"})
  // device: AccountDeviceEntity;

}
