import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum PayOSWebhookStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
}

export class PayOSWebhookDataDto {
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
  transactionDateTime: string;

  @IsEnum(PayOSWebhookStatus)
  @IsNotEmpty()
  status: PayOSWebhookStatus;
}

export class PayOSWebhookDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PayOSWebhookDataDto)
  @IsNotEmpty()
  data: PayOSWebhookDataDto;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
