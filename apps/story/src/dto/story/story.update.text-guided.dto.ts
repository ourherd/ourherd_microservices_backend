import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, maxLength, MinLength, minLength } from "class-validator";
import { Transform } from "class-transformer";
import { StoryMedium, StoryType } from "../../constant/story.enum";
import { ApiProperty } from "@nestjs/swagger";
import { StoryUpdateBaseDto } from "./story.update.base.dto";

export class StoryUpdateTextGuidedDto extends StoryUpdateBaseDto {

  static readonly TEXT_MIN_LENGTH: number = 1;
  static readonly TEXT_MAX_LENGTH: number = 750;

  @ApiProperty({
    description: "Story Content 1 ",
    example: 'It is a long established fact that a reader will be distracted by the readable ' +
      'content of a page when looking at its layout. The point of using Lorem Ipsum is that it has ' +
      'a more-or-less normal distribution of letters, as opposed to using \'Content here, content her' +
      'ed over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    minimum: StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH,
    maximum: StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH
  })
  @MinLength(StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_1: string;

  @ApiProperty({
    description: "Story Content 2 ",
    example: 'It is a long established fact that a reader will be distracted by the readable ' +
      'content of a page when looking at its layout. The point of using Lorem Ipsum is that it has ' +
      'a more-or-less normal distribution of letters, as opposed to using \'Content here, content her' +
      'ed over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    minimum: StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH,
    maximum: StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH
  })
  @MinLength(StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_2: string;

  @ApiProperty({
    description: "Story Content 3",
    example: 'It is a long established fact that a reader will be distracted by the readable ' +
      'content of a page when looking at its layout. The point of using Lorem Ipsum is that it has ' +
      'a more-or-less normal distribution of letters, as opposed to using \'Content here, content her' +
      'ed over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    minimum: StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH,
    maximum: StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH
  })
  @MinLength(StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_3: string;

  @ApiProperty({
    description: "Story Content 4",
    example: 'It is a long established fact that a reader will be distracted by the readable ' +
      'content of a page when looking at its layout. The point of using Lorem Ipsum is that it has ' +
      'a more-or-less normal distribution of letters, as opposed to using \'Content here, content her' +
      'ed over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    minimum: StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH,
    maximum: StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH
  })
  @MinLength(StoryUpdateTextGuidedDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength(StoryUpdateTextGuidedDto.TEXT_MAX_LENGTH, { message: '' })
  @IsString()
  @IsNotEmpty()
  public content_4: string;

  @Transform(({ value }) => value = StoryType.TEXT_GUIDED )
  @IsString()
  @IsOptional()
  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.TEXT_GUIDED;

  @IsString()
  @IsOptional()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.TEXT;

}
