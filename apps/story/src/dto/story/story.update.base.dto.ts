import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ArrayNotEmpty,
  ArrayMaxSize,
  ArrayMinSize,
  ValidateNested
} from "class-validator";
import { Type } from 'class-transformer';
import { TagAddStoryDto } from "../../../../tag/src/dto/tag.add.story.dto";
import { ApiProperty } from "@nestjs/swagger";
import { TagDto } from "../../../../tag/src/dto/tag.dto";

export class StoryUpdateBaseDto {

  static readonly TEXT_MIN_LENGTH: number = 1;
  static readonly TEXT_MAX_LENGTH: number = 100;

  static readonly TAG_MIN: number = 1;
  static readonly TAG_MAX: number = 5;

  @ApiProperty({
    description: "Story's Title",
    maximum: StoryUpdateBaseDto.TEXT_MAX_LENGTH,
    example: "Title",
    required: false
  })
  @MaxLength( StoryUpdateBaseDto.TEXT_MAX_LENGTH, { message: 'Title cannot be longer than 100 characters' })
  @IsString()
  public title: string;

  @IsBoolean()
  @IsOptional()
  public has_hero_statement: boolean = false;

  @ApiProperty({
    description: "Hero Statement",
    example: "I'm brave",
    maximum: StoryUpdateBaseDto.TEXT_MAX_LENGTH,
    required: false
  })
  @IsString()
  @MaxLength( StoryUpdateBaseDto.TEXT_MAX_LENGTH, { message: 'Hero Statement cannot be longer than 100 characters' })
  @IsOptional()
  public hero_statement: string;

  @ApiProperty({
    minimum: StoryUpdateBaseDto.TAG_MIN,
    maximum: StoryUpdateBaseDto.TAG_MAX,
    isArray: true,
    type: TagAddStoryDto,
  })
  @IsArray()
  // @ArrayNotEmpty()
  // @ArrayMinSize(StoryUpdateBaseDto.TAG_MIN)
  // @ArrayMaxSize(StoryUpdateBaseDto.TAG_MAX)
  public tags: TagAddStoryDto[];

  @ApiProperty({
    isArray: true,
    type: TagDto,
  })
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(StoryUpdateBaseDto.TAG_MAX)
  public new_tags: TagDto[];

}
