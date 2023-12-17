import { Column, DeleteDateColumn, Entity } from "typeorm";
import { AbstractEntity } from '@app/database/base/base.entity';

export enum ModerationStatus {
  CO_CREATION = "CO_CREATION",
  ON_REVIEW = "ON_REVIEW",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
  PUBLISHED = "PUBLISHED",
}

@Entity({
  name: 'moderation'
})
export class ModerationEntity extends AbstractEntity {

  @Column({ nullable: false })
  public story_id: string;

  @Column({
    type: "enum",
    enum: ModerationStatus,
    default: ModerationStatus.ON_REVIEW
  })
  public status: ModerationStatus;

  @DeleteDateColumn({ type: 'timestamp' })
  public deleted_at!: Date;

  @Column({ nullable: true })
  public internal_note: string;

  @Column({ nullable: true })
  public message_member: string;

  @Column({ nullable: true })
  public moderator_name: string;

  @Column({ nullable: true, type: 'timestamp' })
  public requested_changes_at!: Date;

  @Column({ nullable: true, type: 'timestamp' })
  public approved_at!: Date;

  @Column({ nullable: true, default: 0 })
  readonly revision: number;

}
