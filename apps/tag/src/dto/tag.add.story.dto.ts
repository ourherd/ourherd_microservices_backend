import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TagAddStoryDto {

  @ApiProperty({
    description: "Tag UUID",
    example: Array('da2fc0cf-ea3f-4805-9916-52c8a437310a', 'b706e9c6-a4b9-44d4-bbae-e2827df6e183')
  })
  @IsUUID()
  @IsString()
  public id: string;

}


