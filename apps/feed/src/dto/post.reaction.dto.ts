import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ReactionType } from "./../entity/reaction.entity"
import { Transform } from "class-transformer";

export class PostReactionDto {

  @IsUUID()
  @IsString()
  public member_id: string;

  @IsUUID()
  @IsString()
  public story_id: string;

  @IsOptional()
  @Transform(({ value }) => value.toString().toUpperCase())
  @IsEnum(ReactionType)
  public reaction_type?: ReactionType = ReactionType.LOVE;

}
