// src/bookings/dto/extend-hold-time.dto.ts
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ExtendHoldTimeDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  additionalMinutes?: number = 15; // Mặc định gia hạn 15 phút
}