import { Column, Entity, BeforeUpdate, BeforeInsert } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";

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
  // Entity function

}
