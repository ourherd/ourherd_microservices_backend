import { PaginationDto } from "@app/common";
import { IntersectionType } from "@nestjs/swagger";

export class AllTagsAppDto extends IntersectionType(PaginationDto) {}
