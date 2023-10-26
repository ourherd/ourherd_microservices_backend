import { PaginationDto } from "@app/common";
import { IntersectionType } from "@nestjs/swagger";

export class FindMemberDto extends IntersectionType(PaginationDto) {}
