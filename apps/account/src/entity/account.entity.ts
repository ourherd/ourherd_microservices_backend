import { Column, Entity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { AccountDeviceEntity } from './account.device.entity'

@Entity({
  name: 'accounts'
})

// TODO add member id as a FK
export class AccountEntity extends AbstractEntity {

  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  default_role: string;

  @OneToMany(type => AccountDeviceEntity, account => account.id)
  @JoinColumn({name: "account_id"})
  device: AccountDeviceEntity;

  @Column({ default: false })
  verified: boolean;

}
