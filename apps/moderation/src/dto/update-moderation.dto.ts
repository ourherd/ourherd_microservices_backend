import { ApiProperty } from "@nestjs/swagger";
import { ModerationStatus } from "../entity/moderation.entity";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";

export class UpdateModerationDto {

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
  readonly status?: ModerationStatus;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  public moderator_name: string;

  @IsString()
  @IsOptional()
  public internal_note: string;

  @IsString()
  @IsOptional()
  public message_member: string;

}
