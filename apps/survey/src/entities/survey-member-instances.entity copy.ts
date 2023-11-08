import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { SURVEY_STATUS } from "../constant/survey-patterns.constants";

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

  @Column({ nullable: true })
  consent: boolean;

  @Column({ 
    nullable: true, 
    default: SURVEY_STATUS.INCOMPLETE
  })
  status: string;

  // @OneToMany(type => AccountDeviceEntity, account => account.id)
  // @JoinColumn({name: "account_id"})
  // device: AccountDeviceEntity;

}
