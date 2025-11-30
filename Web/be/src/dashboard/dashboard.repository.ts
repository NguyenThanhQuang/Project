import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { Trip, TripDocument } from '../trips/schemas/trip.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { FacetResult, RecentBookingLean } from './types/finance-report.types';

@Injectable()
export class DashboardRepository {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
  ) {}

  // --- Counts ---
  async countCompanies(
    filter: FilterQuery<CompanyDocument> = {},
  ): Promise<number> {
    return this.companyModel.countDocuments(filter).exec();
  }

  async countUsers(filter: FilterQuery<UserDocument> = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  async countBookings(
    filter: FilterQuery<BookingDocument> = {},
  ): Promise<number> {
    return this.bookingModel.countDocuments(filter).exec();
  }

  async countTrips(filter: FilterQuery<TripDocument> = {}): Promise<number> {
    return this.tripModel.countDocuments(filter).exec();
  }

  // --- Aggregations ---
  async getTotalRevenue(): Promise<number> {
    const result = await this.bookingModel.aggregate<{ total: number }>([
      { $match: { status: BookingStatus.CONFIRMED } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    return result[0]?.total ?? 0;
  }

  async getFinancialFacet(matchStage: any): Promise<FacetResult> {
    const result = await this.bookingModel.aggregate<FacetResult>([
      { $match: matchStage },
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

    return (
      result[0] ?? {
        mainStats: [],
        topCompanies: [],
        revenueChartData: [],
      }
    );
  }

  async findRecentBookings(
    filter: FilterQuery<BookingDocument>,
    limit: number = 20,
  ): Promise<RecentBookingLean[]> {
    return this.bookingModel
      .find(filter, {
        createdAt: 1,
        status: 1,
        totalAmount: 1,
        ticketCode: 1,
        companyId: 1,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('companyId', 'name')
      .lean<RecentBookingLean[]>()
      .exec();
  }
}
