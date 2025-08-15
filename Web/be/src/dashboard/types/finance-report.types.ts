import { Types } from 'mongoose';
import {
  BookingDocument,
  BookingStatus,
} from '../../bookings/schemas/booking.schema';
import { CompanyDocument } from '../../companies/schemas/company.schema';

export interface MainStat {
  _id: BookingStatus;
  totalAmount: number;
  count: number;
}

export interface TopCompany {
  companyId: Types.ObjectId;
  name: string;
  revenue: number;
  bookings: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface FacetResult {
  mainStats: MainStat[];
  topCompanies: TopCompany[];
  revenueChartData: RevenueChartData[];
}

export type PopulatedRecentBooking = Omit<BookingDocument, 'companyId'> & {
  createdAt: Date;
  companyId: Pick<CompanyDocument, '_id' | 'name'>;
};

export interface Transaction {
  id: string;
  date: string;
  company: string;
  status: 'completed';
  type: 'booking' | 'commission' | 'refund';
  amount: number;
  description: string;
}

export interface FinancialReportResponse {
  overview: {
    totalRevenue: number;
    periodRevenue: number;
    totalBookings: number;
    averageOrderValue: number;
    commission: number;
    refunds: number;
  };
  revenueChartData: RevenueChartData[];
  topCompanies: TopCompany[];
  recentTransactions: Transaction[];
}

export interface RecentBookingLean {
  _id: Types.ObjectId;
  createdAt: Date;
  status: BookingStatus;
  totalAmount: number;
  ticketCode?: string;
  companyId?: Pick<CompanyDocument, '_id' | 'name'> | null;
}
