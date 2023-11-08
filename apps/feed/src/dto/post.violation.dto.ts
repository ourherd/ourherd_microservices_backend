import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PostViolationDto {

  @ApiProperty({
    description: "Member ID",
    example: '9322c384-fd8e-4a13-80cd-1cbd1ef95ba8'
  })
  @IsUUID()
  @IsString()
  public member_id: string;

  @ApiProperty({
    description: "Story ID",
    example: '116dcaf4-c1ea-4218-b6b4-e4fd95a3c28e'
  })
  @IsUUID()
  @IsString()
  public story_id: string;

  @ApiProperty({
    description: "Reason to report the story",
    example: 'its off topic'
  })
  @IsString()
  public reason: string;

}
