import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { SanitizedUser } from './schemas/user.schema';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string; role: string };
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
    if (req.user.role !== 'admin' && req.user.userId !== targetUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập thông tin này.',
      );
    }

    const user = await this.usersService.findById(targetUserId);
    return this.usersService.sanitizeUser(user);
  }
}
