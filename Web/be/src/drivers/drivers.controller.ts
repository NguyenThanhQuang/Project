import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { TripStatus } from 'src/trips/schemas/trip.schema';


@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  /**
   * Tạo tài xế cho 1 nhà xe
   * - companyId lấy từ route param (ví dụ /companies/:companyId/drivers)
   */
  @Post('companies/:companyId')
  async createDriver(
    @Param('companyId') companyId: string,
    @Body() dto: CreateDriverDto,
  ) {
    return this.driversService.create(dto, companyId);
  }

  /**
   * (Tạm theo service) findById với number
   * Khuyến nghị sửa service sang string ObjectId.
   */
  @Get(':id/legacy-number')
  async findByIdLegacy(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.findById(id);
  }

  /**
   * Lấy profile tài xế (driver + company + account)
   */
  @Get(':driverId/profile')
  async getDriverProfile(@Param('driverId') driverId: string) {
    return this.driversService.getDriverProfile(driverId);
  }

  /**
   * Lấy trips theo status tổng quát (nếu bạn muốn gọi 1 endpoint)
   * /drivers/:driverId/trips?status=scheduled|departed|arrived
   */
  @Get(':driverId/trips')
  async getTripsByStatus(
    @Param('driverId') driverId: string,
    @Query('status') status: TripStatus,
  ) {
    return this.driversService.getTripsByDriverAndStatus(driverId, status);
  }

  /**
   * Upcoming trips (SCHEDULED)
   */
  @Get(':driverId/trips/upcoming')
  async getUpcomingTrips(@Param('driverId') driverId: string) {
    return this.driversService.getUpcomingTrips(driverId);
  }

  /**
   * Ongoing trips (DEPARTED)
   */
  @Get(':driverId/trips/ongoing')
  async getOngoingTrips(@Param('driverId') driverId: string) {
    return this.driversService.getOngoingTrips(driverId);
  }

  /**
   * Completed trips (ARRIVED)
   */
  @Get(':driverId/trips/completed')
  async getCompletedTrips(@Param('driverId') driverId: string) {
    return this.driversService.getCompletedTrips(driverId);
  }

  /**
   * Doanh thu theo tháng của tài xế
   * /drivers/:driverId/revenue/monthly?year=2025
   */
  @Get(':driverId/revenue/monthly')
  async getDriverMonthlyRevenue(
    @Param('driverId') driverId: string,
    @Query('year') year?: string,
  ) {
    const parsedYear =
      typeof year === 'string' && year.trim() !== '' ? Number(year) : undefined;

    return this.driversService.getDriverMonthlyRevenue(
      driverId,
      Number.isFinite(parsedYear as number) ? (parsedYear as number) : undefined,
    );
  }

  /**
   * Tài xế bắt đầu chuyến
   * PATCH /drivers/:driverId/trips/:tripId/start
   */
  @Patch(':driverId/trips/:tripId/start')
  async driverStartTrip(
    @Param('driverId') driverId: string,
    @Param('tripId') tripId: string,
  ) {
    return this.driversService.driverStartTrip(tripId, driverId);
  }

  /**
   * Tài xế hoàn thành chuyến
   * PATCH /drivers/:driverId/trips/:tripId/complete
   */
  @Patch(':driverId/trips/:tripId/complete')
  async driverCompleteTrip(
    @Param('driverId') driverId: string,
    @Param('tripId') tripId: string,
  ) {
    return this.driversService.driverCompleteTrip(tripId, driverId);
  }
}