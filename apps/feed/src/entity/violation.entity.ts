import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { AbstractEntity } from "@app/database/base/base.entity";

@Entity({
  name: 'story_violations'
})

export class ViolationEntity extends AbstractEntity {

  @ApiProperty({
    description: "Member ID",
    example: '9322c384-fd8e-4a13-80cd-1cbd1ef95ba8'
  })
  @Column({ nullable: false })
  member_id: string;

  @ApiProperty({
    description: "Story ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @Column({ nullable: false })
  story_id: string;

  @ApiProperty()
  @Column({ nullable: false })
  reason: string;

}
