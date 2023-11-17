import { IsString, MaxLength, MinLength, IsBoolean, IsOptional } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class StoryUpdateBaseDto {

  static readonly TEXT_MIN_LENGTH: number = 1;
  static readonly TEXT_MAX_LENGTH: number = 3000;

  @ApiProperty({
    description: "Hero Statement",
    example: "I'm brave",
    minimum: StoryUpdateBaseDto.TEXT_MIN_LENGTH,
    maximum: StoryUpdateBaseDto.TEXT_MAX_LENGTH,
    required: false
  })
  @IsString()
  @MinLength(StoryUpdateBaseDto.TEXT_MIN_LENGTH, { message: '' })
  @MaxLength(StoryUpdateBaseDto.TEXT_MAX_LENGTH, { message: '' })
  public hero_statement: string;
  
  @ApiProperty({
    description: "Story's Title",
    example: "Title",
    required: false
  })
  @IsString()
  public title: string;

  
  @IsBoolean()
  @IsOptional()
  public has_hero_statement: boolean;

}
