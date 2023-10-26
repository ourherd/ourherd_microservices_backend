import { Column, Entity, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { AccountDeviceEntity } from './account.device.entity'
import { MemberEntity } from "apps/member/src/entity/member.entity";

@Entity({
  name: 'accounts'
})

export class AccountEntity extends AbstractEntity {

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  default_role: string;

  // @OneToMany(type => AccountDeviceEntity, account => account.id)
  // @JoinColumn({name: "account_id"})
  // device: AccountDeviceEntity;

  @Column({ default: false })
  verified: boolean;

  @OneToOne(type => MemberEntity)
  @JoinColumn({ name: "member_id" })
  member: MemberEntity

  @Column({ nullable: true })
  member_id: string;

}
