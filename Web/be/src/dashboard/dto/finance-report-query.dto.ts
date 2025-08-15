import { IsEnum, IsOptional } from 'class-validator';

export enum ReportPeriod {
  WEEK = '7d',
  MONTH = '30d',
  QUARTER = '90d',
  YEAR = '365d',
}

export class FinanceReportQueryDto {
  @IsOptional()
  @IsEnum(ReportPeriod, {
    message:
      'Khoảng thời gian không hợp lệ. Vui lòng chọn 7d, 30d, 90d, hoặc 365d.',
  })
  period: ReportPeriod = ReportPeriod.MONTH;
}
