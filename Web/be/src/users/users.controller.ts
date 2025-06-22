import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string; role: UserRole };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);

    return this.usersService.sanitizeUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('ID người dùng không hợp lệ.');
    }
    const user = await this.usersService.findById(userId);
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
}
