import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Token không được để trống.' })
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống.' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
  // Ví dụ về regex kiểm tra độ phức tạp (ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, và 1 ký tự đặc biệt.',
    },
  )
  newPassword: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu mới không được để trống.' })
  @IsString()
  //   @Matches('newPassword', undefined, {
  //     message: 'Xác nhận mật khẩu không khớp với mật khẩu mới.',
  //   })
  confirmNewPassword: string;
}
