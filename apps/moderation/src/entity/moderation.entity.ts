import { Column, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';

export enum ModerationStatus {
  APPROVED = "APPROVED",
  CO_CREATION = "CO_CREATION",
  ON_REVIEW = "ON_REVIEW",
  CLOSED = "CLOSED"
}

@Entity({
  name: 'moderation'
})
export class ModerationEntity extends AbstractEntity {

  @Column({
    type: "enum",
    enum: ModerationStatus,
    default: ModerationStatus.CO_CREATION
  })
  status: ModerationStatus;

}
