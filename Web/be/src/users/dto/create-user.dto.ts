import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', {
    message: 'Số điện thoại không đúng định dạng Việt Nam',
  })
  phone: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(UserRole, {
    each: true,
    message: 'Một hoặc nhiều vai trò không hợp lệ',
  })
  role?: UserRole;

  @IsOptional()
  companyId?: Types.ObjectId;
}
