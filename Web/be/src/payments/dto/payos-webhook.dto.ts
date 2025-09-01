import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * @description Định nghĩa cấu trúc cho object 'data' bên trong webhook của PayOS.
 * Dựa trên dữ liệu thực tế nhận được từ log.
 */
export class PayOSWebhookDataDto {
  @IsString()
  @IsNotEmpty()
  code: string; // Trạng thái chính của giao dịch, "00" là thành công

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsNumber()
  @IsNotEmpty()
  orderCode: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  transactionDateTime: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  paymentLinkId: string;

  @IsOptional()
  @IsString()
  counterAccountBankId?: string;

  @IsOptional()
  @IsString()
  counterAccountBankName?: string;

  @IsOptional()
  @IsString()
  counterAccountName?: string;

  @IsOptional()
  @IsString()
  counterAccountNumber?: string;

  @IsOptional()
  @IsString()
  virtualAccountName?: string;

  @IsOptional()
  @IsString()
  virtualAccountNumber?: string;
}

/**
 * @description Định nghĩa cấu trúc tổng thể của webhook payload từ PayOS.
 */
export class PayOSWebhookDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PayOSWebhookDataDto)
  data?: PayOSWebhookDataDto;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
