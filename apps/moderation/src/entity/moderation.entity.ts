import { Column, DeleteDateColumn, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';

export enum ModerationStatus {
  APPROVED = "APPROVED",
  CO_CREATION = "CO_CREATION",
  ON_REVIEW = "ON_REVIEW",
  REJECT = "REJECT",
  CLOSED = "CLOSED"
}

@Entity({
  name: 'moderation'
})
export class ModerationEntity extends AbstractEntity {

  @Column({
    type: "enum",
    enum: ModerationStatus,
    default: ModerationStatus.ON_REVIEW
  })
  status: ModerationStatus;

  @DeleteDateColumn({ type: 'timestamp' })
  public deleted_at!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public approved_at!: Date;

}
