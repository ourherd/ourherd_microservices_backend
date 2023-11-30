import { StoryDraftBaseDto } from "./story.draft.base.dto";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { StoryMedium, StoryType } from "../../constant/story.enum";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class StoryDraftTextFreeformDto extends StoryDraftBaseDto {

  static readonly TEXT_MIN_LENGTH: number = 1;
  static readonly TEXT_MAX_LENGTH: number = 3000;

  @ApiProperty({
    description: "Story Content",
    example: 'It is a long established fact that a reader will be distracted by the readable ' +
      'content of a page when looking at its layout. The point of using Lorem Ipsum is that it has ' +
      'a more-or-less normal distribution of letters, as opposed to using \'Content here, content her' +
      'ed over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    minimum: StoryDraftTextFreeformDto.TEXT_MIN_LENGTH,
    maximum: StoryDraftTextFreeformDto.TEXT_MAX_LENGTH
  })
  @IsString()
  @MinLength( StoryDraftTextFreeformDto.TEXT_MIN_LENGTH , { message: '' })
  @MaxLength( StoryDraftTextFreeformDto.TEXT_MAX_LENGTH, { message: '' })
  @IsNotEmpty()
  public content: string;

  @Transform(({ value }) => value = StoryType.TEXT_FREE_FORM )
  @IsString()
  @IsOptional()
  @IsEnum(StoryType)
  readonly story_type: StoryType = StoryType.TEXT_FREE_FORM;

  @Transform(({ value }) => value = StoryMedium.TEXT )
  @IsString()
  @IsOptional()
  @IsEnum(StoryMedium)
  readonly story_medium: StoryMedium = StoryMedium.TEXT;

}
