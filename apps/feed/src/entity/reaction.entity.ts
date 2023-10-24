import { Column, Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";

export enum ReactionType {
  LOVE = "LOVE",
  CLAP = "CLAP",
  LIKE = "LIKE",
  SMILE = "SMILE",
  SUPPORT = "SUPPORT",
  STRENGTH = "STRENGTH"
}

@Entity({
  name: 'reactions'
})

export class ReactionEntity extends AbstractEntity {
  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: false })
  story_id: string;

  @Column({
    type: "enum",
    enum: ReactionType,
    default: ReactionType.LOVE
  })
  reaction_type: ReactionType;
}
