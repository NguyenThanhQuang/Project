import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UserDocument } from '../users/schemas/user.schema';
import { BookingsService } from './bookings.service';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';
import { ExtendHoldTimeDto } from './dto/extend-hold-time.dto';
import { LookupBookingDto } from './dto/lookup-booking.dto';

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * @description [PUBLIC/USER] Bắt đầu quá trình đặt vé, tạo một booking "giữ chỗ"
   * @route POST /api/bookings/hold
   */
  @Post('hold')
  @UseGuards(OptionalJwtAuthGuard)
  createHold(
    @Body() createDto: CreateBookingHoldDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.createHold(createDto, req.user);
  }

  /**
   * @description [USER] Hủy một booking (đang giữ chỗ hoặc đã xác nhận)
   * @route DELETE /api/bookings/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  cancelBooking(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.cancelBooking(id, req.user);
  }

  /**
   * @description [PUBLIC] Tra cứu thông tin vé
   * @route POST /api/bookings/lookup
   */
  @Post('lookup')
  lookupBooking(@Body() lookupDto: LookupBookingDto) {
    return this.bookingsService.lookupBooking(lookupDto);
  }

  /**
   * @description [USER] Lấy danh sách vé đang giữ chỗ của user
   * @route GET /api/bookings/held
   */
  @Get('held')
  @UseGuards(JwtAuthGuard)
  getHeldBookings(@Req() req: AuthenticatedRequest) {
    return this.bookingsService.getHeldBookings(req.user!);
  }

  /**
   * @description [USER] Lấy tất cả booking của user (đã xác nhận và đã hủy)
   * @route GET /api/bookings/my-bookings
   */
  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  getUserBookings(@Req() req: AuthenticatedRequest) {
    return this.bookingsService.getUserBookings(req.user!);
  }

  /**
   * @description [USER] Lấy tất cả booking của user (tất cả trạng thái)
   * @route GET /api/bookings/all
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  getAllUserBookings(@Req() req: AuthenticatedRequest) {
    return this.bookingsService.getAllUserBookings(req.user!);
  }

  /**
   * @description [USER] Gia hạn thời gian giữ chỗ
   * @route POST /api/bookings/:id/extend
   */
  @Post(':id/extend')
  @UseGuards(JwtAuthGuard)
  extendHoldTime(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() extendDto: ExtendHoldTimeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.extendHoldTime(
      id,
      req.user,
      extendDto.additionalMinutes,
    );
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBookingById(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const booking = await this.bookingsService.findOne(id, req.user);
    
    return {
      statusCode: HttpStatus.OK,
      data: booking,
    };
  }
  /**
   * @description [USER] Tạo lại link thanh toán cho vé đang giữ chỗ
   * @route POST /api/bookings/:id/regenerate-payment
   */
  @Post(':id/regenerate-payment')
  @UseGuards(JwtAuthGuard)
  async regeneratePaymentLink(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.bookingsService.regeneratePaymentLink(id, req.user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Tạo link thanh toán thành công',
      data: result,
    };
  }
}