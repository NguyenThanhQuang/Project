import { IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.phone)
  @IsNotEmpty({ message: 'Email hoặc Số điện thoại không được để trống' })
  @IsString()
  identifier: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
