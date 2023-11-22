import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TagsAppDto {

  @IsUUID()
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

}
