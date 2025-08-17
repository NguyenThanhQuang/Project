import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UserRole } from '../users/schemas/user.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { UpdateTripStopStatusDto } from './dto/update-trip-stop-status.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roles: UserRole[];
    companyId?: Types.ObjectId;
  };
}

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  /**
   * @description [PUBLIC] Tìm kiếm các chuyến đi có sẵn cho người dùng.
   * Endpoint này công khai, không cần xác thực.
   * Người dùng cung cấp điểm đi, điểm đến (tên tỉnh/thành) và ngày đi.
   * @route GET /api/trips?from=...&to=...&date=...
   * @param {QueryTripsDto} queryTripsDto - DTO chứa các tham số truy vấn.
   * @returns {Promise<any>} - Danh sách các chuyến đi phù hợp.
   */
  @Get()
  async findPublicTrips(@Query() queryTripsDto: QueryTripsDto) {
    return this.tripsService.findPublicTrips(queryTripsDto);
  }

  /**
   * @description [MANAGEMENT] Lấy danh sách chuyến đi cho mục đích quản lý.
   * Dành cho Admin (xem tất cả hoặc lọc theo companyId) và Company Admin (chỉ xem của công ty mình).
   * @route GET /api/trips/management/all
   * @param {AuthenticatedRequest} req - Request đã được xác thực, chứa thông tin user.
   * @param {string} companyId - (Tùy chọn) ID của công ty để lọc (dành cho Admin).
   * @returns {Promise<TripDocument[]>} - Danh sách chuyến đi.
   */
  @Get('management/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async findTripsForManagement(
    @Req() req: AuthenticatedRequest,
    @Query('companyId') companyId?: string,
  ) {
    const user = req.user;
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      if (!user.companyId) {
        throw new ForbiddenException(
          'Tài khoản của bạn không được liên kết với nhà xe nào.',
        );
      }
      return this.tripsService.findForManagement(user.companyId);
    }
    return this.tripsService.findForManagement(companyId);
  }

  /**
   * @description [PUBLIC] Lấy thông tin chi tiết của một chuyến đi.
   * Endpoint này công khai, ai cũng có thể xem để biết chi tiết chuyến đi trước khi đặt vé.
   * @route GET /api/trips/:tripId
   * @param {Types.ObjectId} tripId - ID của chuyến đi.
   * @returns {Promise<TripDocument>} - Chi tiết chuyến đi.
   */
  @Get(':tripId')
  async findTripById(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
  ) {
    return this.tripsService.findOne(tripId.toString());
  }

  /**
   * @description [MANAGEMENT] Tạo một chuyến đi mới.
   * Dành cho Admin và Company Admin.
   * @route POST /api/trips
   * @param {CreateTripDto} createTripDto - Dữ liệu để tạo chuyến đi mới.
   * @param {AuthenticatedRequest} req - Request đã được xác thực.
   * @returns {Promise<TripDocument>} - Chuyến đi vừa được tạo.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createTrip(
    @Body() createTripDto: CreateTripDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    // Kiểm tra quyền sở hữu: Company Admin chỉ được tạo chuyến đi cho công ty của mình.
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      if (
        !user.companyId ||
        createTripDto.companyId.toString() !== user.companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền tạo chuyến đi cho công ty của mình.',
        );
      }
    }
    // Nếu user là ADMIN, không cần kiểm tra gì thêm, RolesGuard đã cho phép
    return this.tripsService.create(createTripDto);
  }

  /**
   * @description [MANAGEMENT] Cập nhật thông tin một chuyến đi.
   * Sử dụng PUT có thể ngụ ý thay thế tài nguyên, nhưng PATCH thường được dùng cho cập nhật một phần.
   * Trong trường hợp này, ta dùng PUT để thống nhất với code gốc của bạn.
   * @route PUT /api/trips/:tripId
   * @param {Types.ObjectId} tripId - ID của chuyến đi cần cập nhật.
   * @param {UpdateTripDto} updateTripDto - Dữ liệu cập nhật.
   * @param {AuthenticatedRequest} req - Request đã được xác thực.
   * @returns {Promise<TripDocument>} - Chuyến đi sau khi đã cập nhật.
   */
  @Put(':tripId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async updateTrip(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    // Kiểm tra quyền sở hữu: Company Admin chỉ được cập nhật chuyến đi của công ty mình.
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      const trip = await this.tripsService.findOne(tripId.toString());
      if (
        !user.companyId ||
        trip.companyId._id.toString() !== user.companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn không có quyền cập nhật chuyến đi này.',
        );
      }
    }
    return this.tripsService.update(tripId.toString(), updateTripDto);
  }

  /**
   * @description [MANAGEMENT] Cập nhật trạng thái của một điểm dừng trong chuyến đi.
   * Ví dụ: Đánh dấu là xe "đã đến" trạm nghỉ.
   * @route PATCH /api/trips/:tripId/stops/:stopLocationId
   * @param {string} tripId - ID của chuyến đi.
   * @param {string} stopLocationId - ID của địa điểm dừng.
   * @param {UpdateTripStopStatusDto} updateDto - Trạng thái mới.
   * @param {AuthenticatedRequest} req - Request đã được xác thực.
   * @returns {Promise<TripDocument>} - Chuyến đi sau khi cập nhật trạng thái điểm dừng.
   */
  @Patch(':tripId/stops/:stopLocationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async updateStopStatus(
    @Param('tripId', ParseMongoIdPipe) tripId: string,
    @Param('stopLocationId', ParseMongoIdPipe) stopLocationId: string,
    @Body() updateDto: UpdateTripStopStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    // Kiểm tra quyền sở hữu
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      const trip = await this.tripsService.findOne(tripId);
      if (
        !user.companyId ||
        trip.companyId._id.toString() !== user.companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn không có quyền cập nhật chuyến đi này.',
        );
      }
    }
    return this.tripsService.updateTripStopStatus(
      tripId,
      stopLocationId,
      updateDto.status,
    );
  }

  /**
   * @description [MANAGEMENT] Xóa một chuyến đi.
   * @route DELETE /api/trips/:tripId
   * @param {Types.ObjectId} tripId - ID của chuyến đi cần xóa.
   * @param {AuthenticatedRequest} req - Request đã được xác thực.
   */
  @Delete(':tripId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrip(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    // Kiểm tra quyền sở hữu: Company Admin chỉ được xóa chuyến đi của công ty mình.
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      const trip = await this.tripsService.findOne(tripId.toString());
      if (
        !user.companyId ||
        trip.companyId._id.toString() !== user.companyId.toString()
      ) {
        throw new ForbiddenException('Bạn không có quyền xóa chuyến đi này.');
      }
    }
    await this.tripsService.remove(tripId.toString());
    // Không trả về nội dung khi thành công.
  }

  /**
   * @description [MANAGEMENT] Hủy một chuyến đi.
   * Logic bao gồm cập nhật trạng thái chuyến, vé, ghế và gửi thông báo.
   * @route PATCH /api/trips/:tripId/cancel
   * @param {Types.ObjectId} tripId - ID của chuyến đi cần hủy.
   * @param {AuthenticatedRequest} req - Request đã được xác thực.
   * @returns {Promise<TripDocument>} - Chuyến đi sau khi đã hủy.
   */
  @Patch(':tripId/cancel') // <-- DÙNG PATCH VÌ CHỈ CẬP NHẬT MỘT PHẦN (STATUS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async cancelTrip(
    @Param('tripId', ParseMongoIdPipe) tripId: Types.ObjectId,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    // Kiểm tra quyền sở hữu đối với Company Admin
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      const trip = await this.tripsService.findOne(tripId.toString());
      if (
        !user.companyId ||
        trip.companyId._id.toString() !== user.companyId.toString()
      ) {
        throw new ForbiddenException('Bạn không có quyền hủy chuyến đi này.');
      }
    }
    return this.tripsService.cancel(tripId.toString());
  }
}
