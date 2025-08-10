import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CompanyStatus } from '../schemas/company.schema';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Tên nhà xe không được để trống' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'Mã nhà xe không được để trống' })
  @IsString()
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Mã nhà xe chỉ chứa chữ hoa, số và dấu gạch dưới (_)',
  })
  @MinLength(2)
  @MaxLength(20)
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logoUrl?: string;

  @IsOptional()
  @IsEnum(CompanyStatus, { message: 'Trạng thái không hợp lệ.' })
  status?: CompanyStatus;
}
