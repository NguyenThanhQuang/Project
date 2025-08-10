import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
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
}
