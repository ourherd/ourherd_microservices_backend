import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TagStoryDto {

  @ApiProperty({
    description: "Tag UUID",
    example: 'b706e9c6-a4b9-44d4-bbae-e2827df6e183'
  })
  @IsUUID()
  public tag_id: string;

  @ApiProperty({
    description: "Story UUID",
    example: 'da2fc0cf-ea3f-4805-9916-52c8a437310a'
  })
  @IsUUID()
  public story_id: string;

}


