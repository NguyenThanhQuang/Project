import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import {
  Company,
  CompanyDocument,
  CompanyStatus,
} from '../companies/schemas/company.schema';
import { Trip, TripDocument, TripStatus } from '../trips/schemas/trip.schema';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { FinanceReportQueryDto } from './dto/finance-report-query.dto';
import {
  FacetResult,
  FinancialReportResponse,
  RecentBookingLean,
  Transaction,
} from './types/finance-report.types';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    private readonly configService: ConfigService,
  ) {}

  async getAdminStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    type RevenueAggregateResult = { totalRevenue: number };

    const [
      totalCompanies,
      totalUsers,
      totalBookings,
      revenueResult,
      todayBookings,
      activeTrips,
      newCompaniesToday,
    ] = await Promise.all([
      this.companyModel.countDocuments(),
      this.userModel.countDocuments({ roles: UserRole.USER }),
      this.bookingModel.countDocuments({ status: BookingStatus.CONFIRMED }),
      this.bookingModel.aggregate<RevenueAggregateResult>([
        { $match: { status: BookingStatus.CONFIRMED } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      this.bookingModel.countDocuments({
        status: BookingStatus.CONFIRMED,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      this.tripModel.countDocuments({ status: TripStatus.DEPARTED }),
      this.companyModel.countDocuments({ status: CompanyStatus.ACTIVE }),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue ?? 0;

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
    const period = queryDto.period;
    const days = parseInt(period.replace('d', ''), 10);
    const startDate = dayjs().subtract(days, 'day').startOf('day').toDate();

    const commissionRate =
      this.configService.get<number>('COMMISSION_RATE') ?? 0.15;

    const totalRevenueResult = await this.bookingModel.aggregate<{
      total: number;
    }>([
      { $match: { status: BookingStatus.CONFIRMED } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenueAllTime = totalRevenueResult[0]?.total ?? 0;

    const aggregationResult = await this.bookingModel.aggregate<FacetResult>([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED] },
        },
      },
      {
        $facet: {
          mainStats: [
            {
              $group: {
                _id: '$status',
                totalAmount: { $sum: '$totalAmount' },
                count: { $sum: 1 },
              },
            },
          ],
          topCompanies: [
            { $match: { status: BookingStatus.CONFIRMED } },
            {
              $group: {
                _id: '$companyId',
                totalRevenue: { $sum: '$totalAmount' },
                totalBookings: { $sum: 1 },
              },
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: 'companies',
                localField: '_id',
                foreignField: '_id',
                as: 'companyInfo',
              },
            },
            { $unwind: '$companyInfo' },
            {
              $project: {
                _id: 0,
                companyId: '$_id',
                name: '$companyInfo.name',
                revenue: '$totalRevenue',
                bookings: '$totalBookings',
              },
            },
          ],
          revenueChartData: [
            { $match: { status: BookingStatus.CONFIRMED } },
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                revenue: { $sum: '$totalAmount' },
                bookings: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                date: '$_id',
                revenue: '$revenue',
                bookings: '$bookings',
              },
            },
          ],
        },
      },
    ]);

    const stats = aggregationResult[0] ?? {
      mainStats: [],
      topCompanies: [],
      revenueChartData: [],
    };

    const confirmedStats = stats.mainStats.find(
      (s) => s._id === BookingStatus.CONFIRMED,
    ) ?? { totalAmount: 0, count: 0 };
    const cancelledStats = stats.mainStats.find(
      (s) => s._id === BookingStatus.CANCELLED,
    ) ?? { totalAmount: 0, count: 0 };

    const periodRevenue = confirmedStats.totalAmount;
    const periodBookings = confirmedStats.count;
    const periodRefunds = cancelledStats.totalAmount;

    const recentBookings: RecentBookingLean[] = await this.bookingModel
      .find(
        { createdAt: { $gte: startDate } },
        {
          createdAt: 1,
          status: 1,
          totalAmount: 1,
          ticketCode: 1,
          companyId: 1,
        },
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('companyId', 'name')
      .lean<RecentBookingLean[]>()
      .exec();

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
