import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUserReviewDto {
  @IsOptional()
  @IsInt({ message: 'Số sao phải là số nguyên.' })
  @Min(1, { message: 'Số sao đánh giá phải từ 1 đến 5.' })
  @Max(5, { message: 'Số sao đánh giá phải từ 1 đến 5.' })
  rating?: number;

  @IsOptional()
  @IsString({ message: 'Bình luận phải là chuỗi ký tự.' })
  @MaxLength(2000, { message: 'Bình luận không được vượt quá 2000 ký tự.' })
  comment?: string;
}
