import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ReactionType } from "../../entity/reaction/reaction.entity"
import { Transform, Exclude } from "class-transformer";

export class PostReactionDto {

  @Exclude()
  public member_id: string;

  @ApiProperty({
    description: "Story ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @IsUUID()
  @IsString()
  public story_id: string;

  @ApiProperty({
    description: "List of all reactions",
    enum: ReactionType,
    isArray: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().toUpperCase())
  @IsEnum(ReactionType)
  public reaction_type?: ReactionType = ReactionType.LOVE;

}
