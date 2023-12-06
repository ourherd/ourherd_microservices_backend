import { IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "@app/common";

export class StoriesListDto extends IntersectionType(PaginationDto) {}
