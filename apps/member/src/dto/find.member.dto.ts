import { PaginationDto } from "@app/common";
import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class FindMemberDto extends IntersectionType(PaginationDto) {


}
