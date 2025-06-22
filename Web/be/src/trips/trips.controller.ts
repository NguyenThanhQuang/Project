import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';
// import { RolesGuard } from '../auth/guards/roles.guard'; // Phân quyền Roles
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../users/schemas/user.schema';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  /**
   * @description Tìm kiếm chuyến đi theo điểm đi, điểm đến và ngày đi.
   * @route GET /api/trips
   * @access Public
   */
  @Get()
  async findAvailableTrips(@Query() queryTripsDto: QueryTripsDto) {
    // Frontend sẽ gửi query params: from, to, date
    // Ví dụ: /api/trips?from=TP.HCM&to=Đà Lạt&date=2024-08-20
    return this.tripsService.findAll(queryTripsDto);
  }

  /**
   * @description Xem chi tiết một chuyến đi (bao gồm hành trình và sơ đồ ghế).
   * @route GET /api/trips/:tripId
   * @access Public
   */
  @Get(':tripId')
  async findTripById(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
  ) {
    return this.tripsService.findOne(tripId);
  }

  // Hiện tại chỉ bảo vệ bằng JwtAuthGuard, chưa thêm RolesGuard

  /**
   * @description Tạo một chuyến đi mới.
   * @route POST /api/trips
   * @access Admin, Company_Admin (cần logic phân quyền cụ thể trong service)
   */
  @Post()
  @UseGuards(JwtAuthGuard) // Chỉ người dùng đã đăng nhập mới được tạo
  // @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN) // Sẽ thêm sau
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async createTrip(@Body() createTripDto: CreateTripDto /*, @Req() req */) {
    // TODO: Nếu là COMPANY_ADMIN, cần đảm bảo createTripDto.companyId khớp với companyId của user đó
    // const user = req.user;
    // if (user.role === UserRole.COMPANY_ADMIN && createTripDto.companyId.toString() !== user.companyId.toString()) {
    //   throw new ForbiddenException('Bạn không có quyền tạo chuyến đi cho nhà xe này.');
    // }
    return this.tripsService.create(createTripDto);
  }

  /**
   * @description Cập nhật thông tin một chuyến đi.
   * @route PUT /api/trips/:tripId
   * @access Admin, Company_Admin (cần logic phân quyền cụ thể trong service)
   */
  @Put(':tripId')
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTrip(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
    @Body() updateTripDto: UpdateTripDto,
    /* @Req() req */
  ) {
    // TODO: Nếu là COMPANY_ADMIN, cần đảm bảo họ chỉ cập nhật chuyến đi thuộc nhà xe của họ.
    // const user = req.user;
    // const trip = await this.tripsService.findOne(tripId); // Fetch trip to check companyId
    // if (user.role === UserRole.COMPANY_ADMIN && trip.companyId._id.toString() !== user.companyId.toString()) {
    //   throw new ForbiddenException('Bạn không có quyền cập nhật chuyến đi này.');
    // }
    return this.tripsService.update(tripId.toString(), updateTripDto);
  }

  /**
   * @description Xóa một chuyến đi.
   * @route DELETE /api/trips/:tripId
   * @access Admin, Company_Admin (chưa có logic phân quyền cụ thể trong service)
   */
  @Delete(':tripId')
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrip(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
    /* @Req() req */
  ) {
    await this.tripsService.remove(tripId.toString());
  }
}
