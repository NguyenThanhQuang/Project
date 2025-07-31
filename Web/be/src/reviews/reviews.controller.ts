// src/reviews/reviews.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * @description [PUBLIC] Lấy danh sách đánh giá (đã được kiểm duyệt)
   * @route GET /api/reviews
   */
  @Get()
  findAll(@Query() queryDto: QueryReviewDto) {
    return this.reviewsService.findAll(queryDto);
  }

  /**
   * @description [USER] Tạo một đánh giá mới
   * @route POST /api/reviews
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.create(createReviewDto, req.user);
  }

  // --- ADMIN ROUTES ---

  /**
   * @description [ADMIN] Lấy tất cả đánh giá (bao gồm cả đánh giá bị ẩn)
   * @route GET /api/reviews/admin/all
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllForAdmin(@Query() queryDto: QueryReviewDto) {
    return this.reviewsService.findAllForAdmin(queryDto);
  }

  /**
   * @description [ADMIN] Cập nhật trạng thái hiển thị của một đánh giá
   * @route PATCH /api/reviews/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    if (typeof updateReviewDto.isVisible !== 'boolean') {
      throw new BadRequestException(
        'Trạng thái isVisible là bắt buộc và phải là boolean.',
      );
    }
    return this.reviewsService.updateVisibility(id, updateReviewDto.isVisible);
  }

  /**
   * @description [ADMIN] Xóa một đánh giá
   * @route DELETE /api/reviews/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
