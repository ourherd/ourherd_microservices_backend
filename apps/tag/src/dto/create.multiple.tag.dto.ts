import { ArrayMinSize, ArrayNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TagDto } from "./tag.dto"

export class  CreateMultipleTagDto {
  @ApiProperty({
    minimum: 5,
    maximum: 28,
    isArray: true,
    type: TagDto,
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  public data: TagDto[];

}
