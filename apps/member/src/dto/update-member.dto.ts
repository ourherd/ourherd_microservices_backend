import { IsDate, IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateMemberDto } from "./create-member.dto";
import { EmploymentType } from "../entity/member.entity";

export class UpdateMemberDto extends PartialType(CreateMemberDto) {

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  public first_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  public last_name: string;

  @IsString()
  @IsOptional()
  @Length(1, 55)
  public display_name: string;

  @IsDate()
  @IsOptional()
  public birthday: Date;

  @IsString()
  @IsOptional()
  public country: string;

  @IsString()
  @IsOptional()
  public suburb: string;

  // Validates for a string
  @IsInt()
  @IsOptional()
  public postal_code: string;

  @IsString()
  @IsOptional()
  public mobile_number: string;

  // Validates for a string
  @IsString()
  @IsOptional()
  @IsEnum(EmploymentType)
  public employment: EmploymentType = EmploymentType.NO_SELECTED;

  // Validates for a string
  @IsString()
  @IsOptional()
  public bio: string;

}
