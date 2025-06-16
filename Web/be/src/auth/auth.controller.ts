import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
    const clientBaseUrl = this.configService.get<string>('CLIENT_URL', '');
    if (!token) {
      const clientErrorUrl = `${clientBaseUrl}/auth/verification-result?success=false&message=InvalidToken`;
      return res.redirect(clientErrorUrl || '/');
    }

    try {
      const result = await this.authService.processEmailVerification(token);
      const successUrl = `${clientBaseUrl}/auth/verification-result?success=true&accessToken=${result.accessToken}`;
      return res.redirect(successUrl);
    } catch (error) {
      let errorMessage = 'VerificationFailed';
      if (error instanceof UnauthorizedException)
        errorMessage = 'TokenInvalidOrExpired';
      else if (error instanceof BadRequestException)
        errorMessage = 'InvalidToken';

      this.authService.logger.error(
        `Email verification failed for token ${token.substring(0, 10)}... : ${error.message}`,
      );
      const failureUrl = `${clientBaseUrl}/auth/verification-result?success=false&message=${errorMessage}`;
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
    try {
      await this.authService.requestResendVerificationEmail(resendDto.email);
      return {
        message:
          'Nếu tài khoản tồn tại và chưa được xác thực, một email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.authService.logger.error(
        `Error resending verification email for ${resendDto.email}: ${error.message}`,
      );
      return {
        message:
          'Yêu cầu gửi lại email đã được xử lý. Nếu có lỗi, vui lòng thử lại sau hoặc liên hệ hỗ trợ.',
      };
    }
  }
}
