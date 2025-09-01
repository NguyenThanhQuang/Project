import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { PayOSWebhookDto } from './dto/payos-webhook.dto';
import { PaymentsService } from './payments.service';

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
  @UseGuards(OptionalJwtAuthGuard)
  createPaymentLink(
    @Body() createPaymentLinkDto: CreatePaymentLinkDto,
    @Req() req: AuthenticatedRequest,
  ) {
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
  // THAY ĐỔI: Dùng Object để nhận body mà không bị validation
  async handlePayOSWebhook(@Body() webhookData: object) {
    // Ép kiểu thủ công sau khi đã nhận được dữ liệu
    await this.paymentsService.handleWebhook(webhookData as PayOSWebhookDto);
    return { message: 'Webhook received' };
  }
}
