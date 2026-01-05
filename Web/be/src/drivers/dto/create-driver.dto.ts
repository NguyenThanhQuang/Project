import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { DriverStatus } from "../schema/driver.schema";

export class CreateDriverDto {
      @IsNotEmpty({ message: 'Tên tài xế không được để trống' })
      @IsString()
      @MaxLength(100)
      name: string;

     @IsNotEmpty({ message: 'Giấy phép lái xe không được để trống' })
      @MaxLength(100)
      license: string;
      
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
  avatarUrl?: string;

  @IsOptional()
    @IsEnum(DriverStatus, { message: 'Trạng thái không hợp lệ.' })
    status?: DriverStatus;

}
