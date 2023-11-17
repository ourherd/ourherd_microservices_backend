import { IsOptional } from "class-validator";
import { StoryVisibility } from "../../constant/story.enum";
import { ApiProperty } from "@nestjs/swagger";


export class StoryUpdateSettingDto {
    
  @ApiProperty({
    type: StoryVisibility,
    enum: StoryVisibility,
    example: StoryVisibility.PRIVATE
  })
  @IsOptional()
  visibility: StoryVisibility;
  
  @ApiProperty()
  @IsOptional()
  is_shareable: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_name: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_location: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_gender: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_age: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_batyr_instragram: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_batyr_tiktok: boolean;
  
  @ApiProperty()
  @IsOptional()
  share_contacted: boolean;
  
}
