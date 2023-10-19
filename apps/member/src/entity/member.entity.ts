import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';

@Entity({
  name: 'member'
})

export class MemberEntity extends AbstractEntity {

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  display_name: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  suburb: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  employment: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  sequence_identity: string;

}
