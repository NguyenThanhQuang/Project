import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';

import { sanitizeUser, validateCompanyAdminAccess } from '@obtp/business-logic';
import { AuthUserResponse, SystemEvent, UserRole } from '@obtp/shared-types';
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@obtp/validation';

import { CompanyDocument } from '../companies/schemas/company.schema';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Company') private companyModel: Model<CompanyDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // === REGISTER ===
  async register(payload: RegisterPayload): Promise<{ message: string }> {
    // Check tồn tại (DB Interaction)
    const existingUser = await this.userModel.findOne({
      $or: [{ email: payload.email.toLowerCase() }, { phone: payload.phone }],
    });

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        // Logic cũ: Resend token nếu chưa verify
        // Đây là Use Case riêng, xử lý vắn tắt cho đúng flow
        this.eventEmitter.emit(SystemEvent.USER_VERIFICATION_RESENT, {
          email: existingUser.email,
          token: existingUser.emailVerificationToken, // Giả định token còn hạn
        });
        return {
          message:
            'Email đã tồn tại nhưng chưa kích hoạt. Email mới đã được gửi.',
        };
      }
      throw new ConflictException('Email hoặc số điện thoại đã được sử dụng.');
    }

    // Prepare Data (Business Logic in Service due to DB coupling)
    const token = this.generateSecureToken();
    const expiresIn = parseInt(
      this.configService.get(
        'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS',
        '86400000',
      ),
    );

    // Create (DB Interaction)
    const newUser = await this.userModel.create({
      ...payload,
      email: payload.email.toLowerCase(),
      roles: [UserRole.USER],
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + expiresIn),
    });

    // Side Effects (Events)
    this.eventEmitter.emit(SystemEvent.USER_REGISTERED, {
      email: newUser.email,
      name: newUser.name,
      token: token,
    });

    return {
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.',
    };
  }

  // === LOGIN ===
  async login(payload: LoginPayload) {
    // Find User (cho phép login bằng email hoặc phone)
    const identifier = payload.identifier.toLowerCase();
    const user = await this.userModel
      .findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      })
      .select('+passwordHash'); // Mongoose select

    if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác.');
    }

    // Validate Constraints (Business Logic calls)
    if (user.isBanned) throw new ForbiddenException('Tài khoản đã bị khóa.');
    if (!user.isEmailVerified)
      throw new UnauthorizedException('Email chưa được xác thực.');

    // Validate Company Admin logic
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      const company = await this.companyModel.findById(user.companyId);
      try {
        // Gọi logic thuần túy để check, tách biệt if/else dài dòng
        validateCompanyAdminAccess(
          user.roles,
          user.companyId?.toString(),
          company?.status,
        );
      } catch (e: any) {
        throw new UnauthorizedException(
          e.message === 'ERR_COMPANY_SUSPENDED'
            ? 'Nhà xe đang bị đình chỉ'
            : 'Lỗi quyền truy cập',
        );
      }
    }

    // Generate Token (Lib)
    const userObject = user.toObject();

    const userForAuth: any = {
      ...userObject,
      id: userObject._id.toString(),
      companyId: userObject.companyId
        ? userObject.companyId.toString()
        : undefined,
    };

    // Lúc này sanitizeUser mới chịu nhận vì đúng kiểu
    const cleanUser = sanitizeUser(userForAuth) as AuthUserResponse;

    // Dùng type của CleanUser để đảm bảo payload JWT chuẩn
    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
      companyId: user.companyId?.toString(),
    });

    return {
      accessToken,
      user: cleanUser,
    };
  }

  // === PASSWORD & ACTIVATION (Sử dụng lại types từ shared-types) ===
  async resetPassword(payload: ResetPasswordPayload) {
    const user = await this.userModel
      .findOne({
        passwordResetToken: payload.token,
        passwordResetExpires: { $gt: new Date() },
      })
      .select('+passwordHash');

    if (!user)
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn.');

    // Chống trùng password cũ
    if (await bcrypt.compare(payload.newPassword, user.passwordHash)) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng với mật khẩu cũ.',
      );
    }

    user.passwordHash = payload.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Đặt lại mật khẩu thành công.' };
  }
}
