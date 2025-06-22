import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là một chuỗi' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('VN', {
    message: 'Số điện thoại không đúng định dạng Việt Nam',
  })
  phone?: string;

  // Cập nhật email cần xác thực lại email mới,
  // Để dành hỏi thầy.
  // @IsOptional()
  // @IsEmail({}, { message: 'Email mới không đúng định dạng' })
  // email?: string;
}
