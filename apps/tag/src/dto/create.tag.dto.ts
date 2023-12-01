import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { v4 } from "uuid";
import { firstUppercase } from "@app/common/string/string-first-uppercase";

export class  CreateTagDto {

  @IsUUID()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiProperty({
    description: "Tag verified",
    required: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value } ) => value === false)
  public verified: boolean = false;

  @ApiProperty({
    description: "Tag name",
    example: 'depression',
    required: false
  })
  // @Matches(RegExp('/[^a-zA-Z ]/g'))
  @IsString()
  @Length(1, 35)
  @Transform(({value}) => firstUppercase(value).trim())
  public name: string;

  @IsNumber()
  @IsOptional()
  readonly order: number;

}
