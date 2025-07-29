import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống.' })
  @IsString()
  currentPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống.' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
  newPassword: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu mới không được để trống.' })
  @IsString()
  confirmNewPassword: string;
}
