import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

export class CreateGuestReviewDto extends CreateReviewDto {
  @IsNotEmpty({ message: 'Số điện thoại liên hệ không được để trống.' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại liên hệ không hợp lệ.' })
  contactPhone: string;
}
