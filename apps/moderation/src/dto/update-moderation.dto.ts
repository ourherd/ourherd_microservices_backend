import { OmitType } from "@nestjs/mapped-types";
import { CreateModerationDto } from "./create-moderation.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateModerationDto extends OmitType(CreateModerationDto,
  ["story_id", "status"]) {

  @ApiProperty({
    description: "Moderation ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @IsUUID()
  @IsOptional()
  public id: string;

}
