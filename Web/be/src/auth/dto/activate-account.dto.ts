import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @IsNotEmpty({ message: 'Token không được để trống.' })
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống.' })
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
  newPassword: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu mới không được để trống.' })
  confirmNewPassword: string;
}
