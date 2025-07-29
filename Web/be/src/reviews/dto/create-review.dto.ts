import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'ID chuyến đi không được để trống.' })
  @IsMongoId({ message: 'ID chuyến đi không hợp lệ.' })
  tripId: Types.ObjectId;

  @IsNotEmpty({ message: 'ID đơn đặt vé không được để trống.' })
  @IsMongoId({ message: 'ID đơn đặt vé không hợp lệ.' })
  bookingId: Types.ObjectId;

  @IsNotEmpty({ message: 'Số sao đánh giá không được để trống.' })
  @IsInt({ message: 'Số sao phải là số nguyên.' })
  @Min(1, { message: 'Số sao đánh giá phải từ 1 đến 5.' })
  @Max(5, { message: 'Số sao đánh giá phải từ 1 đến 5.' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Bình luận phải là chuỗi ký tự.' })
  @MaxLength(2000, { message: 'Bình luận không được vượt quá 2000 ký tự.' })
  comment?: string;

  @IsOptional()
  @IsBoolean({ message: 'Giá trị ẩn danh không hợp lệ.' })
  isAnonymous?: boolean;
}
