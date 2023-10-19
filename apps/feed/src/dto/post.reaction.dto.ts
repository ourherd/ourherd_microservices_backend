import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";


export enum ReactionType {
  LOVE = 'LOVE'
}

export class PostReactionDto {

  @IsUUID()
  @IsString()
  public member_id: string;

  @IsUUID()
  @IsString()
  public story_id: string;

  @IsEnum(ReactionType)
  @IsOptional()
  public reaction_type?: ReactionType = ReactionType.LOVE;

}
