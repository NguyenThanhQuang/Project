export type ReportPeriod = "7d" | "30d" | "90d" | "365d";

export interface OverviewStats {
  totalRevenue: number;
  periodRevenue: number;
  totalBookings: number;
  averageOrderValue: number;
  commission: number;
  refunds: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface TopCompany {
  name: string;
  revenue: number;
  bookings: number;
}

export interface Transaction {
  id: string;
  date: string;
  company: string;
  status: "completed";
  type: "booking" | "commission" | "refund";
  amount: number;
  description: string;
}

export interface FinanceReport {
  overview: OverviewStats;
  revenueChartData: RevenueChartData[];
  topCompanies: TopCompany[];
  recentTransactions: Transaction[];
}
