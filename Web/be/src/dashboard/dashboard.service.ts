import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { BookingStatus } from '../bookings/schemas/booking.schema';
import { CompanyStatus } from '../companies/schemas/company.schema';
import { TripStatus } from '../trips/schemas/trip.schema';
import { UserRole } from '../users/schemas/user.schema';
import { DashboardRepository } from './dashboard.repository'; // Import Repository
import { FinanceReportQueryDto } from './dto/finance-report-query.dto';
import {
  FinancialReportResponse,
  RecentBookingLean,
  Transaction,
} from './types/finance-report.types';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository, // Inject Repository
    private readonly configService: ConfigService,
  ) {}

  async getAdminStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalCompanies,
      totalUsers,
      totalBookings,
      totalRevenue, // Lấy trực tiếp từ repo
      todayBookings,
      activeTrips,
      newCompaniesToday,
    ] = await Promise.all([
      this.dashboardRepository.countCompanies(),
      this.dashboardRepository.countUsers({ roles: UserRole.USER }),
      this.dashboardRepository.countBookings({
        status: BookingStatus.CONFIRMED,
      }),
      this.dashboardRepository.getTotalRevenue(),
      this.dashboardRepository.countBookings({
        status: BookingStatus.CONFIRMED,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      this.dashboardRepository.countTrips({ status: TripStatus.DEPARTED }),
      this.dashboardRepository.countCompanies({ status: CompanyStatus.ACTIVE }),
    ]);

    return {
      totalCompanies,
      totalUsers,
      totalBookings,
      totalRevenue,
      todayBookings,
      activeTrips,
      newCompaniesToday,
    };
  }

  async getFinancialReport(
    queryDto: FinanceReportQueryDto,
  ): Promise<FinancialReportResponse> {
    const { period, companyId, startDate, endDate } = queryDto;

    let matchStartDate: Date;
    let matchEndDate: Date = new Date();

    if (startDate && endDate) {
      matchStartDate = dayjs(startDate).startOf('day').toDate();
      matchEndDate = dayjs(endDate).endOf('day').toDate();
    } else {
      const days = parseInt(period.replace('d', ''), 10);
      matchStartDate = dayjs().subtract(days, 'day').startOf('day').toDate();
    }

    const commissionRate =
      this.configService.get<number>('COMMISSION_RATE') ?? 0.15;

    // 1. Get Total Revenue All Time
    const totalRevenueAllTime =
      await this.dashboardRepository.getTotalRevenue();

    // 2. Prepare Match Query
    const baseMatch: any = {
      createdAt: { $gte: matchStartDate, $lte: matchEndDate },
      status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED] },
    };

    if (companyId && Types.ObjectId.isValid(companyId)) {
      baseMatch.companyId = new Types.ObjectId(companyId);
    }

    // 3. Get Facet Data
    const stats = await this.dashboardRepository.getFinancialFacet(baseMatch);

    const confirmedStats = stats.mainStats.find(
      (s) => s._id === BookingStatus.CONFIRMED,
    ) ?? { totalAmount: 0, count: 0 };
    const cancelledStats = stats.mainStats.find(
      (s) => s._id === BookingStatus.CANCELLED,
    ) ?? { totalAmount: 0, count: 0 };

    const periodRevenue = confirmedStats.totalAmount;
    const periodBookings = confirmedStats.count;
    const periodRefunds = cancelledStats.totalAmount;

    // 4. Get Recent Bookings
    const recentBookingsQuery: any = {
      createdAt: { $gte: matchStartDate, $lte: matchEndDate },
    };
    if (companyId && Types.ObjectId.isValid(companyId)) {
      recentBookingsQuery.companyId = new Types.ObjectId(companyId);
    }

    const recentBookings =
      await this.dashboardRepository.findRecentBookings(recentBookingsQuery);

    const recentTransactions: Transaction[] = recentBookings.flatMap(
      (booking: RecentBookingLean): Transaction[] => {
        const companyName = booking.companyId?.name ?? 'Không xác định';

        const baseTransaction: Omit<
          Transaction,
          'type' | 'amount' | 'description'
        > = {
          id: String(booking._id) + '-main',
          date: booking.createdAt.toISOString(),
          company: companyName,
          status: 'completed',
        };

        if (booking.status === BookingStatus.CONFIRMED) {
          return [
            {
              ...baseTransaction,
              type: 'booking',
              amount: booking.totalAmount,
              description: `Đặt vé #${booking.ticketCode ?? ''}`,
            },
            {
              ...baseTransaction,
              id: String(booking._id) + '-commission',
              type: 'commission',
              amount: -booking.totalAmount * commissionRate,
              description: `Hoa hồng ${commissionRate * 100}%`,
            },
          ];
        }
        if (booking.status === BookingStatus.CANCELLED) {
          return [
            {
              ...baseTransaction,
              type: 'refund',
              amount: -booking.totalAmount,
              description: `Hoàn tiền vé #${booking.ticketCode ?? ''}`,
            },
          ];
        }
        return [];
      },
    );

    return {
      overview: {
        totalRevenue: totalRevenueAllTime,
        periodRevenue,
        totalBookings: periodBookings,
        averageOrderValue:
          periodBookings > 0 ? periodRevenue / periodBookings : 0,
        commission: periodRevenue * commissionRate,
        refunds: periodRefunds,
      },
      revenueChartData: stats.revenueChartData,
      topCompanies: stats.topCompanies,
      recentTransactions,
    };
  }
}
