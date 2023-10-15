import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, Length , IsEnum, IsOptional } from "class-validator";
import { EmploymentEnumType} from '../constant/member-patterns.constants';

export class BaseMemberDto {

  @IsString()
  @IsOptional()
  @Length(1, 55)
  public display_name: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  public first_name: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  public last_name: string;

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
  @IsString()
  @IsOptional()
  public postcode: string;

  // Validates for a string
  @IsString()
  @IsOptional()
  @IsEnum(EmploymentEnumType)
  public employment_status: EmploymentEnumType;

}
