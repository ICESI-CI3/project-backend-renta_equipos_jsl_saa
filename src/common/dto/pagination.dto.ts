import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDTO {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number = 10; // Default value is 10

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    offset?: number = 0; // Default value is 0
}