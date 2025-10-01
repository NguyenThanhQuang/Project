import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SanitizedUser, UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roles: UserRole[];
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: AuthenticatedRequest): Promise<SanitizedUser> {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    return this.usersService.sanitizeUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUser> {
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserProfile(
    @Param('userId') targetUserId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SanitizedUser> {
    if (
      !req.user.roles.includes(UserRole.ADMIN) &&
      req.user.userId !== targetUserId
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập thông tin này.',
      );
    }

    if (!Types.ObjectId.isValid(targetUserId)) {
      throw new NotFoundException('ID người dùng không hợp lệ.');
    }
    const user = await this.usersService.findById(targetUserId);
    return this.usersService.sanitizeUser(user);
  }

  @Patch('me/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeMyPassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    return this.usersService.changePassword(userId, changePasswordDto);
  }
  /**
   * [ADMIN] Lấy danh sách tất cả người dùng với dữ liệu tổng hợp
   * @route GET /api/users/admin/all
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsersForAdmin() {
    return this.usersService.findAllForAdmin();
  }
  /**
   * [ADMIN] Cập nhật trạng thái (cấm/bỏ cấm) của một người dùng
   * @route PATCH /api/users/admin/:userId/status
   */
  @Patch('admin/:userId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUserStatus(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateUserStatus(
      userId,
      updateUserStatusDto.isBanned,
    );
  }
  @Get('me/bookings')
  @UseGuards(JwtAuthGuard)
  getMyBookings(@Req() req: AuthenticatedRequest) {
    return this.usersService.findUserBookings(req.user.userId);
  }
}
