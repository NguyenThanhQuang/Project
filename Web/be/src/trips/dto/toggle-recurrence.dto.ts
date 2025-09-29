import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleRecurrenceDto {
  @IsNotEmpty({ message: 'Trạng thái kích hoạt không được để trống.' })
  @IsBoolean({ message: 'Trạng thái kích hoạt phải là giá trị boolean.' })
  isActive: boolean;
}
