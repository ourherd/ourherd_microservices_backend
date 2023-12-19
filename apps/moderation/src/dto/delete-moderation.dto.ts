import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Transform } from "class-transformer";

export class DeleteModerationDto {

  @ApiProperty({
    description: "Moderation ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @IsUUID()
  public id: string;

  @Transform(({ value }) => value = new Date().toISOString())
  public deleted_at: string;

}
