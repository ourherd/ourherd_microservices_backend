import { Column, Entity } from "typeorm";
import { AbstractEntity } from "@app/database/base/base.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'tags'
})

export class TagEntity extends AbstractEntity {

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  verified: boolean;

}
