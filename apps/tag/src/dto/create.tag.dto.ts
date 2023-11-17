import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { Transform } from "class-transformer";
import { v4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";
//import { stringFirstUppercase } from "@app/common/string/string-first-uppercase";

export class CreateTagDto {

  @IsUUID()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value = v4())
  public id: string = v4();

  @ApiProperty({
    description: "Tag verified",
    default: false,
    example: 'true | false',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === false)
  readonly verified: boolean = false;

  @ApiProperty({
    description: "Member first name",
    example: 'depression',
    required: false
  })
  @IsString()
  @Length(1, 40)
  //@Transform(({value}) => stringFirstUppercase(value))
  public name: string;

  @IsNumber()
  @IsOptional()
  readonly order: number;

}


