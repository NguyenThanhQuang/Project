export interface AdminStats {
  totalCompanies: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  activeTrips: number;
  newCompaniesToday: number;
}

export interface StatCardProps {
  icon: React.ReactElement;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  bgColor: string;
}

export interface TodayActivityCardProps {
  todayBookings: number;
  activeTrips: number;
  newCompanies: number;
}
