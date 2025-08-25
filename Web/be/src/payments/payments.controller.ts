import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { PaymentsService } from './payments.service';
import { PayOSWebhookDto } from './dto/payos-webhook.dto';

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * @description [USER] Tạo link thanh toán PayOS cho một booking đã được giữ chỗ (held).
   * @route POST /api/payments/create-link
   */
  @Post('create-link')
  @UseGuards(JwtAuthGuard)
  createPaymentLink(
    @Body() createPaymentLinkDto: CreatePaymentLinkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new BadRequestException(
        'Không tìm thấy thông tin người dùng đã xác thực.',
      );
    }

    return this.paymentsService.createPaymentLink(
      createPaymentLinkDto,
      req.user,
    );
  }

  /**
   * @description [PUBLIC] Endpoint để PayOS gửi webhook xác nhận thanh toán.
   * @route POST /api/payments/webhook
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handlePayOSWebhook(@Body() webhookData: PayOSWebhookDto) {
    await this.paymentsService.handleWebhook(webhookData);
    return { message: 'Webhook received' };
  }
}
