import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { StoryMedium } from "../../../story/src/constant/story.enum";

export class FiltersDto {

  @ApiProperty({
    description: "Tag UUID",
    example: Array('da2fc0cf-ea3f-4805-9916-52c8a437310a', 'b706e9c6-a4b9-44d4-bbae-e2827df6e183')
  })
  @IsArray()
  @IsOptional()
  public tags: string[];

  @ApiProperty({
    description: "Story Medium",
    example: 'display_name',
    required: false
  })
  @IsString()
  @IsOptional()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium;

}
