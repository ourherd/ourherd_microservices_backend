import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
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

  @ApiProperty()
  @Column({ nullable: false })
  member_id: string;

  @ApiProperty()
  @Column({ nullable: false })
  story_id: string;

  @ApiProperty({
    enum: ReactionType
  })
  @Column({
    type: "enum",
    enum: ReactionType,
    default: ReactionType.LOVE
  })
  reaction_type: ReactionType;
}
