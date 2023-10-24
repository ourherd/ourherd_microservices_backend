import { IsDate, IsEnum, IsOptional, IsString, Length, IsEmail, IsInt } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { EmploymentEnumType } from "../constant/member-patterns.constants";

export class UpdateMemberDto {

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  public email: string;

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

  @IsInt()
  @IsOptional()
  public postal_code: string;

  @IsString()
  @IsOptional()
  public mobile_number: string;

  @IsString()
  @IsOptional()
  @IsEnum(EmploymentEnumType)
  public employment_status: EmploymentEnumType;

  // Validates for a string
  @IsString()
  @IsOptional()
  public bio: string;

}
