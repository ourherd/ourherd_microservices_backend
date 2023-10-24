import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';
import { IsEnum, IsOptional } from "class-validator";

export enum MemberStatus {
  ACTIVATED = 'ACTIVATED',
  INACTIVATED = 'INACTIVATED',
  BANNED = 'BANNED'
}

export enum EmploymentType {
  NO_SELECTED = 'NO_SELECTED',
  STUDYING_AT_SCHOOL = 'STUDYING_AT_SCHOOL',
  STUDYING_AT_TAFE = 'STUDYING_AT_TAFE',
  STUDYING_AT_UNIVERSITY = 'STUDYING_AT_UNIVERSITY',
  WORKING_FULL_TIME = 'WORKING_FULL_TIME',
  WORKING_PART_TIME = 'WORKING_PART_TIME',
  WORKING_CASUALLY = 'WORKING_CASUALLY',
  UNEMPLOYED = 'UNEMPLOYED',
  NO_APPLY = 'NO_APPLY'
}


@Entity({
  name: 'members'
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

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus = MemberStatus.ACTIVATED;

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

  @IsOptional()
  @IsEnum(EmploymentType)
  employment?: EmploymentType = EmploymentType.NO_SELECTED;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  sequence_identity: string;

}
