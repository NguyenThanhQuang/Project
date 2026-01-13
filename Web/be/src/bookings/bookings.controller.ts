import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { BookingsService } from './bookings.service';
import { CheckInTicketDto } from './dto/check-in-ticket.dto';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';
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
  @UseGuards(OptionalJwtAuthGuard) // Cho phép cả khách và người dùng đã đăng nhập
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
   * [DRIVER] Soát vé (Check-in) bằng mã vé
   * @route POST /api/bookings/check-in
   */
  @Post('check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async checkInTicket(
    @Body() checkInDto: CheckInTicketDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new Error('User ID is missing');
    }
    return this.bookingsService.checkInTicket(checkInDto, userId);
  }
}
