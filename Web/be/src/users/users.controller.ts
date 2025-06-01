import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string; role: string };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    return this.usersService.sanitizeUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserProfile(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('ID người dùng không hợp lệ.');
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    return this.usersService.sanitizeUser(user);
  }
}
