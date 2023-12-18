import { ApiProperty } from "@nestjs/swagger";
import { ModerationStatus } from "../entity/moderation.entity";
import { IsEnum, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { Exclude } from "class-transformer";

export class CreateModerationDto {

  @ApiProperty({
    description: "Member status",
    enum: ModerationStatus,
    isArray: false,
    default: ModerationStatus.ON_REVIEW,
    example: 'ON_REVIEW | CO_CREATION | REJECTED',
    required: false
  })
  @IsEnum(ModerationStatus)
  @IsOptional()
  readonly status?: ModerationStatus = ModerationStatus.ON_REVIEW;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public moderator_name: string;

  @ApiProperty({
    description: "Story ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @IsUUID()
  @IsOptional()
  public story_id: string;

  @IsString()
  @IsOptional()
  public internal_note: string;

  @IsString()
  @IsOptional()
  public message_member: string;


}
