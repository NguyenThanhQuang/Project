import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';
import { FinanceReportQueryDto } from './dto/finance-report-query.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getAdminStats() {
    return this.dashboardService.getAdminStats();
  }
  /**
   * @route GET /api/dashboard/finance-report?period=30d
   */
  @Get('finance-report')
  getFinancialReport(@Query() queryDto: FinanceReportQueryDto) {
    return this.dashboardService.getFinancialReport(queryDto);
  }
}
