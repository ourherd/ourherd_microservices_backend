import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { MemberEntity } from "./member.entity";

@Entity({
  name: 'member_verifications'
})

export class MemberVerificationEntity extends AbstractEntity {

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: "member_id" })
  member: MemberEntity

  @Column({ nullable: true })
  email_token: string;

}
