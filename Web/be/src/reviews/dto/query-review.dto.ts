import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class QueryReviewDto {
  @IsOptional()
  @IsMongoId({ message: 'ID nhà xe không hợp lệ.' })
  companyId?: string;

  @IsOptional()
  @IsMongoId({ message: 'ID chuyến đi không hợp lệ.' })
  tripId?: string;

  @IsOptional()
  @IsMongoId({ message: 'ID người dùng không hợp lệ.' })
  userId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  // Các tham số phân trang
  // @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  // page?: number = 1;

  // @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  // limit?: number = 10;
}
