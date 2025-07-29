import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hiển thị không hợp lệ.' })
  isVisible?: boolean;
}
