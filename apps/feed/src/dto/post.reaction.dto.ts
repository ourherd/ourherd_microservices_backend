import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";


export enum ReactionType {
  LOVE = 'LOVE'
}

export class PostReactionDto {

  @IsUUID()
  @IsString()
  readonly member_id: string;

  @IsUUID()
  @IsString()
  readonly story_id: string;

  @IsEnum(ReactionType)
  @IsOptional()
  readonly reaction_type?: ReactionType = ReactionType.LOVE;

}
