import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { AccountEntity } from "./account.entity";

@Entity({
  name: 'reset_password_verifications'
})

export class ResetPasswordVerificationEntity extends AbstractEntity {

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: "account_id" })
  account: AccountEntity

  @Column({ nullable: true })
  email_token: string;

}
