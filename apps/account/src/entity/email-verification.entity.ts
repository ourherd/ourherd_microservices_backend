import { Column, Entity, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { AccountDeviceEntity } from './account.device.entity'
import { MemberEntity } from "apps/member/src/entity/member.entity";

@Entity({
  name: 'email_verifications'
})

export class EmailVerificationEntity extends AbstractEntity {

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  email_token: string;

}
