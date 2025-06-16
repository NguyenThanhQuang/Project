import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

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

  @Get('verify-email')
  async verifyEmailToken(@Query('token') token: string, @Res() res: Response) {
    const clientBaseUrl = this.configService.get<string>('CLIENT_URL');
    const verificationResultPath = '/auth/verification-result';

    if (!token) {
      const clientErrorUrl = `${clientBaseUrl}${verificationResultPath}?success=false&message=InvalidTokenLink`;
      return res.redirect(clientErrorUrl);
    }

    try {
      const result = await this.authService.processEmailVerification(token);
      const successUrl = `${clientBaseUrl}${verificationResultPath}?success=true&message=EmailVerified&accessToken=${result.accessToken}`;
      return res.redirect(successUrl);
    } catch (error) {
      let errorMessageKey = 'VerificationFailed';
      if (error instanceof UnauthorizedException) {
        errorMessageKey = error.message.includes('hết hạn')
          ? 'TokenExpired'
          : 'TokenInvalidOrUsed';
      } else if (error instanceof BadRequestException) {
        errorMessageKey = 'InvalidTokenFormat';
      }

      this.logger.error(
        `Email verification failed for token (first 10 chars: ${token.substring(0, 10)}...): ${error.message}`,
        error.stack,
      );
      const failureUrl = `${clientBaseUrl}${verificationResultPath}?success=false&message=${errorMessageKey}`;
      return res.redirect(failureUrl);
    }
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
}
