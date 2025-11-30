import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingStatus } from '../bookings/schemas/booking.schema';
import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import {
  FinanceReportQueryDto,
  ReportPeriod,
} from './dto/finance-report-query.dto';

const mockDashboardRepository = {
  countCompanies: jest.fn(),
  countUsers: jest.fn(),
  countBookings: jest.fn(),
  countTrips: jest.fn(),
  getTotalRevenue: jest.fn(),
  getFinancialFacet: jest.fn(),
  findRecentBookings: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key) => {
    if (key === 'COMMISSION_RATE') return 0.1;
    return null;
  }),
};

describe('DashboardService', () => {
  let service: DashboardService;
  let repository: typeof mockDashboardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: DashboardRepository, useValue: mockDashboardRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    repository = module.get(DashboardRepository);

    jest.clearAllMocks();
  });

  // ================= TEST ADMIN STATS =================
  describe('getAdminStats', () => {
    it('should return overview stats', async () => {
      repository.countCompanies.mockResolvedValue(10);
      repository.countUsers.mockResolvedValue(100);
      repository.countBookings
        .mockResolvedValueOnce(500) 
        .mockResolvedValueOnce(20); 
      repository.countTrips.mockResolvedValue(5);
      repository.getTotalRevenue.mockResolvedValue(1000000);

      const result = await service.getAdminStats();

      expect(result.totalCompanies).toBe(10);
      expect(result.totalUsers).toBe(100);
      expect(result.totalBookings).toBe(500);
      expect(result.totalRevenue).toBe(1000000);
      expect(result.todayBookings).toBe(20);
    });
  });

  // ================= TEST FINANCIAL REPORT =================
  describe('getFinancialReport', () => {
    const queryDto: FinanceReportQueryDto = { period: ReportPeriod.MONTH };

    it('should return financial report with correct structure', async () => {
      repository.getTotalRevenue.mockResolvedValue(5000000);

      const mockFacetResult = {
        mainStats: [
          { _id: BookingStatus.CONFIRMED, totalAmount: 1000000, count: 10 },
          { _id: BookingStatus.CANCELLED, totalAmount: 200000, count: 2 },
        ],
        topCompanies: [
          {
            companyId: 'comp1',
            name: 'Nhà xe A',
            revenue: 500000,
            bookings: 5,
          },
        ],
        revenueChartData: [
          { date: '2023-10-01', revenue: 100000, bookings: 1 },
        ],
      };
      repository.getFinancialFacet.mockResolvedValue(mockFacetResult);

      const mockRecentBookings = [
        {
          _id: 'book1',
          createdAt: new Date(),
          status: BookingStatus.CONFIRMED,
          totalAmount: 100000,
          ticketCode: 'VE01',
          companyId: { name: 'Nhà xe A' },
        },
      ];
      repository.findRecentBookings.mockResolvedValue(mockRecentBookings);

      const result = await service.getFinancialReport(queryDto);

      expect(result.overview.totalRevenue).toBe(5000000);
      expect(result.overview.periodRevenue).toBe(1000000);
      expect(result.overview.refunds).toBe(200000);
      expect(result.topCompanies).toHaveLength(1);
      expect(result.recentTransactions.length).toBeGreaterThan(0);
    });
  });
});
