import { Column, Entity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { AccountDeviceEntity } from './account.device.entity'

@Entity({
  name: 'account'
})

export class AccountEntity extends AbstractEntity {

  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  default_role: string;

  @OneToMany(type => AccountDeviceEntity, account => account.id)
  @JoinColumn({name: "account_id"})  
  device: AccountDeviceEntity;

}
