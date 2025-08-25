import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PayOSWebhookDataDto {
  @IsString()
  @IsNotEmpty()
  orderCode: string;

  // @IsNumber()
  // amount: number;

  // @IsString()
  // status: string;
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
