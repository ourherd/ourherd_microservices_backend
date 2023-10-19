import { Column, Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";

export enum ReactionTypes {
  LOVE = "LOVE",
  CLAP = "CLAP"
}

@Entity({
  name: 'reaction'
})

export class ReactionEntity extends AbstractEntity {
  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: false })
  story_id: string;

  @Column({
    type: "enum",
    enum: ReactionTypes,
    default: ReactionTypes.LOVE
  })
  reaction_type: ReactionTypes;
}
