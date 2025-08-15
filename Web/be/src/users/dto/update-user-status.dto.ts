import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: 'Trạng thái cấm không được để trống.' })
  @IsBoolean({
    message: 'Trạng thái cấm phải là giá trị boolean (true/false).',
  })
  isBanned: boolean;
}
