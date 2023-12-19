import { ApiProperty } from "@nestjs/swagger";
import { ModerationStatus } from "../entity/moderation.entity";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Length, ValidateIf } from "class-validator";

const INTERNAL_MESSAGE_MIN = 20;
const INTERNAL_MESSAGE_MAX = 300;
const MESSAGE_MEMBER_MIN = 50;

export class CreateModerationDto {

  @ApiProperty({
    description: "Moderation status",
    enum: ModerationStatus,
    isArray: false,
    default: ModerationStatus.ON_REVIEW,
    example: 'ON_REVIEW | CO_CREATION | REJECTED | PUBLISHED',
    required: false
  })
  @IsEnum(ModerationStatus)
  @IsOptional()
  public status?: ModerationStatus = ModerationStatus.ON_REVIEW;

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

  @ValidateIf(o => o.status === ModerationStatus.CO_CREATION ||
    o.status === ModerationStatus.REJECTED)
  @IsNotEmpty()
  @Length(INTERNAL_MESSAGE_MIN, INTERNAL_MESSAGE_MAX)
  public internal_note: string;

  @ValidateIf(o => o.status === ModerationStatus.CO_CREATION ||
    o.status === ModerationStatus.REJECTED)
  @IsNotEmpty()
  @Length(MESSAGE_MEMBER_MIN)
  public message_member: string;

}
