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
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SanitizedUser, UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';
interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string; role: UserRole };
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
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== targetUserId) {
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

  @Get('test/admin-only')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminOnlyRouteTest() {
    return {
      message:
        'Chào mừng Admin! Bạn đã truy cập thành công vào route được bảo vệ.',
    };
  }

  @Get('test/management-access')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  managementAccessRouteTest() {
    return {
      message: 'Chào mừng người quản lý (Admin hoặc Company Admin)!',
    };
  }

  // (Tùy chọn) Endpoint cho Admin cập nhật thông tin của bất kỳ người dùng nào
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  // @Patch(':userId')
  // async updateUserByAdmin(
  //   @Param('userId') targetUserId: string,
  //   @Body() updateUserDto: UpdateUserDto, // Có thể cần một AdminUpdateUserDto riêng biệt
  // ): Promise<SanitizedUser> {
  //   if (!Types.ObjectId.isValid(targetUserId)) {
  //     throw new NotFoundException('ID người dùng không hợp lệ.');
  //   }
  //   // Cần đảm bảo rằng admin không thể thay đổi vai trò hoặc các trường nhạy cảm khác một cách vô ý
  //   // thông qua DTO chung này. Xem xét việc tạo AdminUpdateUserDto.
  //   return this.usersService.updateProfile(targetUserId, updateUserDto);
  // }

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
}
