import { Type } from 'class-transformer';
import { IsOptional, IsString, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}