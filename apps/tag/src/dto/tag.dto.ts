import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from "uuid";
import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";
import { firstUppercase } from "@app/common/string/string-first-uppercase";

export class TagDto {

  static readonly TAG_MIN_LENGTH: number = 1;
  static readonly TAG_MAX_LENGTH: number = 35;

  @IsUUID()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean()
  public verified: boolean = false;

  @ApiProperty({
    description: "Tag name",
    example: 'depression',
    required: false
  })
  @IsString()
  @Length(TagDto.TAG_MIN_LENGTH, TagDto.TAG_MAX_LENGTH)
  @Matches(RegExp(/^[a-zA-Z\s]*$/))
  @Transform(({value}) => firstUppercase(value))
  public name: string;

  @IsNumber()
  @IsOptional()
  readonly order: number;

}
