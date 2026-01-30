import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private processingTokens = new Set<string>(); // THÊM: Set để theo dõi token đang xử lý

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('verify-email')
  async verifyEmailToken(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token xác thực không hợp lệ');
    }

    // CHẶN DUPLICATE REQUEST - THÊM
    if (this.processingTokens.has(token)) {
      this.logger.warn(`Duplicate verification request for token: ${token.substring(0, 10)}...`);
      throw new BadRequestException('Đang xử lý yêu cầu xác thực. Vui lòng đợi...');
    }

    try {
      // ĐÁNH DẤU TOKEN ĐANG ĐƯỢC XỬ LÝ
      this.processingTokens.add(token);
      
      const result = await this.authService.processEmailVerification(token);
      
      return {
        success: true,
        message: 'Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.',
        accessToken: result.accessToken,
        user: result.user,
      };
    } catch (error) {
      this.logger.error(`Email verification failed for token: ${token.substring(0, 10)}...`, error);
      
      // PHÂN BIỆT CÁC LOẠI LỖI
      if (error instanceof UnauthorizedException) {
        const errorResponse = error.getResponse();
        let errorMessage = 'Token không hợp lệ hoặc đã hết hạn.';
        
        if (typeof errorResponse === 'object' && errorResponse !== null) {
          if ('message' in errorResponse) {
            const message = errorResponse.message as string;
            if (message.includes('đã được sử dụng')) {
              // Token đã được sử dụng - có thể email đã verify
              errorMessage = 'Token đã được sử dụng. Email của bạn có thể đã được xác thực trước đó. Vui lòng thử đăng nhập.';
            } else if (message.includes('hết hạn')) {
              errorMessage = 'Token xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.';
            } else {
              errorMessage = message;
            }
          }
        }
        
        throw new BadRequestException(errorMessage);
      }
      
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Không tìm thấy người dùng với token này');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Đã xảy ra lỗi trong quá trình xác thực');
    } finally {
      // XÓA TOKEN KHỎI DANH SÁCH ĐANG XỬ LÝ
      this.processingTokens.delete(token);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const createUserPayload: CreateUserDto = {
      email: registerDto.email,
      phone: registerDto.phone,
      password: registerDto.password,
      name: registerDto.name,
    };
    return this.authService.register(createUserPayload);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('resend-verification-email')
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(@Body() resendDto: ResendVerificationEmailDto) {
    await this.authService.requestResendVerificationEmail(resendDto.email);
    return {
      message:
        'Nếu tài khoản của bạn tồn tại và chưa được xác thực, một email xác thực mới sẽ được gửi đến địa chỉ email đã đăng ký. Vui lòng kiểm tra hộp thư của bạn (bao gồm cả thư mục spam).',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPasswordWithToken(resetPasswordDto);
  }

  @Get('validate-reset-token')
  async validateResetToken(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token không được cung cấp.');
    }
    const result = await this.authService.validatePasswordResetToken(token);
    if (!result.isValid) {
      throw new BadRequestException(
        result.message || 'Token không hợp lệ hoặc đã hết hạn.',
      );
    }
    return result;
  }

  @Post('activate-account')
  @HttpCode(HttpStatus.OK)
  async activateAccount(@Body() activateDto: ActivateAccountDto) {
    return this.authService.activateCompanyAdminAccount(activateDto);
  }

  @Get('validate-activation-token')
  async validateActivationToken(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token không được cung cấp.');
    }
    const result = await this.authService.validateActivationToken(token);
    if (!result.isValid) {
      throw new BadRequestException(
        result.message || 'Token không hợp lệ hoặc đã hết hạn.',
      );
    }
    return result;
  }
}