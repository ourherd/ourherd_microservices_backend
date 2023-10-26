import { Transform } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty({
        description: 'Limit must not be less than 1 and limit must not be greater than 50',
        minimum: 1,
        maximum: 50,
        required: true
    })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(50)
    limit: number;

    @ApiProperty({
        description: 'Page must not be less than 1',
        minimum: 1,
        required: true
    })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page: number;
}
