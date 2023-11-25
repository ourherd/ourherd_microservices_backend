import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, Length, Matches } from "class-validator";
import { stringFirstUppercaseAfterHyphen } from "@app/common/string/string-first-uppercase";
import { ApiProperty } from "@nestjs/swagger";
import { EmploymentType, MemberStatus } from "../entity/member.entity";
import { Transform } from "class-transformer";

export class UpdateMemberDto  {

  @ApiProperty({
    description: "Member status",
    enum: MemberStatus,
    isArray: false,
    default: MemberStatus.ACTIVATED,
    example: 'ACTIVATED | INACTIVATED | BANNED',
    required: false
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  readonly status?: MemberStatus = MemberStatus.ACTIVATED;

  @ApiProperty({
    description: "Member verified",
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
    example: 'first_name',
    required: false
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  public first_name: string;

  @ApiProperty({
    description: "Member last name",
    example: 'last_name',
    required: false
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  public last_name: string;

  @ApiProperty({
    description: "Member display name",
    example: 'display_name',
    required: false
  })
  @IsString()
  @IsOptional()
  @Length(1, 55)
  public display_name: string;

  @ApiProperty({
    description: "Member birthday",
    example: '14/11/1992',
    required: false
  })
  @IsDate()
  @IsOptional()
  public birthday: Date;

  @ApiProperty({
    description: "Member Country",
    example: 'Australia',
    required: false
  })
  @IsString()
  @IsOptional()
  public country: string;

  @ApiProperty({
    description: "Member Suburb",
    example: 'Newtown',
    required: false
  })
  @IsString()
  @IsOptional()
  public suburb: string;

  @ApiProperty({
    description: "Member Postcode",
    example: 2000,
    required: false
  })
  @IsInt()
  @IsOptional()
  public postal_code: string;

  @ApiProperty({
    description: "Member phone number",
    example: '+61 9202 222 222',
    required: false
  })
  @IsString()
  @IsOptional()
  public mobile_number: string;

  @ApiProperty({
    description: "Member has a different gender than the one in the list",
    example: 'true',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  public freeform_gender: boolean = false;

  @ApiProperty({
    description: "Member gender",
    example: 'Androgyny',
    required: false
  })
  @Matches(RegExp('^(?=.*[A-Za-z])[A-Za-z]+(?:-[A-Za-z]+)+$'))
  @Transform(({ value }) => stringFirstUppercaseAfterHyphen(value.toString()))
  @IsString()
  @IsOptional()
  public gender: string;

  @ApiProperty({
    description: "Member Employment type",
    enum: EmploymentType,
    isArray: false,
    default: EmploymentType.NO_APPLY,
    example: 'NO_SELECTED, STUDYING_AT_SCHOOL, STUDYING_AT_TAFE, STUDYING_AT_UNIVERSITY, WORKING_FULL_TIME, WORKING_PART_TIME, WORKING_CASUALLY, UNEMPLOYED, NO_APPLY',
    required: false
  })
  @IsString()
  @IsOptional()
  @IsEnum(EmploymentType)
  public employment: EmploymentType = EmploymentType.NO_SELECTED;

  @ApiProperty({
    description: "Member Bio",
    example: 'It is a long established fact that a reader will be distracted by the readable content of a ' +
      'page when looking at its layout.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised',
    required: false
  })
  @IsString()
  @IsOptional()
  public bio: string;

}
