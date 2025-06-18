import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  SanitizedUser,
  UserDocument,
  UserRole,
} from '../users/schemas/user.schema';
import {
  InternalCreateUserPayload,
  UsersService,
} from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  private async generateSecureToken(length: number = 32): Promise<string> {
    return randomBytes(length).toString('hex');
  }

  async register(registerDto: CreateUserDto): Promise<{ message: string }> {
    const emailLower = registerDto.email.toLowerCase();

    const existingUserByEmail =
      await this.usersService.findOneByEmail(emailLower);
    if (existingUserByEmail) {
      if (
        !existingUserByEmail.isEmailVerified &&
        existingUserByEmail.emailVerificationToken &&
        existingUserByEmail.emailVerificationExpires
      ) {
        if (
          existingUserByEmail.emailVerificationExpires.getTime() < Date.now()
        ) {
          existingUserByEmail.emailVerificationToken =
            await this.generateSecureToken();
          const expiresInMs = parseInt(
            this.configService.get<string>(
              'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS',
              '86400000',
            ),
            10,
          );
          existingUserByEmail.emailVerificationExpires = new Date(
            Date.now() + expiresInMs,
          );
          await existingUserByEmail.save();
          this.logger.log(
            `Regenerated verification token for existing unverified user: ${emailLower}. New Token: ${existingUserByEmail.emailVerificationToken}`,
          );
        } else {
          this.logger.log(
            `Existing unverified user ${emailLower} attempted to register again. Resending email with existing token: ${existingUserByEmail.emailVerificationToken}`,
          );
        }
        try {
          if (!existingUserByEmail.emailVerificationToken) {
            this.logger.error(
              `Critical error: Token somehow became undefined before resending for ${emailLower}`,
            );
            throw new InternalServerErrorException(
              'Lỗi hệ thống khi chuẩn bị gửi lại email.',
            );
          }
          await this.mailService.sendVerificationEmail(
            existingUserByEmail.email,
            existingUserByEmail.name,
            existingUserByEmail.emailVerificationToken,
          );
          return {
            message:
              'Email đã được đăng ký nhưng chưa xác thực. Một email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
          };
        } catch (emailError) {
          this.logger.error(
            `Failed to resend verification email to ${existingUserByEmail.email} during registration attempt`,
            emailError,
          );
          throw new InternalServerErrorException(
            'Có lỗi xảy ra khi gửi lại email xác thực.',
          );
        }
      }
      throw new ConflictException(
        'Địa chỉ email này đã được sử dụng và đã xác thực (hoặc không thể gửi lại email xác thực).',
      );
    }

    const existingUserByPhone = await this.usersService.findOneByPhone(
      registerDto.phone,
    );
    if (existingUserByPhone) {
      throw new ConflictException('Số điện thoại này đã được sử dụng.');
    }

    const emailVerificationToken = await this.generateSecureToken();
    const expiresInMsDefault = 86400000; // 24 giờ
    const expiresInMs = parseInt(
      this.configService.get<string>(
        'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS',
        expiresInMsDefault.toString(),
      ),
      10,
    );

    const createUserPayload: InternalCreateUserPayload = {
      ...registerDto,
      email: emailLower,
      role: UserRole.USER,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires: new Date(Date.now() + expiresInMs),
    };

    let newUser: UserDocument;
    try {
      newUser = await this.usersService.create(createUserPayload);
    } catch (error) {
      this.logger.error('Error creating user during registration:', error);
      if (error instanceof ConflictException) throw error;
      if (error.code === 11000) {
        this.logger.warn(
          `MongoDB duplicate key error during user creation for email ${emailLower} or phone ${registerDto.phone}. This might indicate a race condition or an issue with token uniqueness if it's the token field. Error: ${error.message}`,
        );
        throw new ConflictException(
          'Không thể tạo tài khoản do lỗi dữ liệu trùng lặp. Vui lòng thử lại.',
        );
      }
      throw new InternalServerErrorException(
        'Không thể tạo tài khoản. Vui lòng thử lại sau.',
      );
    }

    // Kiểm tra và log token xác thực
    if (newUser && newUser.emailVerificationToken) {
      this.logger.log(
        `[TESTING] New user ${newUser.email} created. Verification Token: ${newUser.emailVerificationToken}`,
      );
    } else {
      this.logger.error(
        `[CRITICAL] New user ${newUser?.email} created BUT emailVerificationToken is MISSING.`,
      );
    }

    try {
      if (!newUser.emailVerificationToken) {
        this.logger.error(
          `[CRITICAL] Attempting to send verification email for ${newUser.email} but token is missing just before sending.`,
        );
        throw new InternalServerErrorException(
          'Lỗi hệ thống: Không tìm thấy token xác thực để gửi email.',
        );
      }
      await this.mailService.sendVerificationEmail(
        newUser.email,
        newUser.name,
        newUser.emailVerificationToken,
      );
    } catch (emailError) {
      this.logger.error(
        `User ${newUser.email} created, but failed to send verification email:`,
        emailError,
      );
      throw new InternalServerErrorException(
        'Tạo tài khoản thành công nhưng không thể gửi email xác thực. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.',
      );
    }

    return {
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.',
    };
  }

  async validateUser(
    identifier: string,
    pass: string,
  ): Promise<UserDocument | null> {
    let user: UserDocument | null = null;
    const identifierLower = identifier.toLowerCase();

    if (isEmail(identifierLower)) {
      user = await this.usersService.findOneByEmail(identifierLower);
    } else {
      user = await this.usersService.findOneByPhone(identifier);
    }

    if (user && (await user.comparePassword(pass))) {
      return user;
    }
    return null;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: SanitizedUser }> {
    const user = await this.validateUser(
      loginDto.identifier,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Email/Số điện thoại hoặc mật khẩu không chính xác.',
      );
    }

    if (!user.isEmailVerified) {
      this.logger.warn(`Login attempt for unverified email: ${user.email}`);
      throw new UnauthorizedException(
        'Tài khoản của bạn chưa được xác thực qua email. Vui lòng kiểm tra email hoặc yêu cầu gửi lại liên kết xác thực.',
      );
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
      companyId: user.companyId?.toString(),
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.usersService.sanitizeUser(user),
    };
  }

  async processEmailVerification(
    token: string,
  ): Promise<{ accessToken: string; user: SanitizedUser }> {
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Token xác thực không hợp lệ.');
    }

    const user = await this.usersService.findOneByCondition({
      emailVerificationToken: token,
    });

    if (!user) {
      throw new UnauthorizedException(
        'Token xác thực không hợp lệ hoặc đã được sử dụng.',
      );
    }

    if (user.isEmailVerified) {
      this.logger.log(
        `Email ${user.email} is already verified. Proceeding to log in.`,
      );
    } else {
      if (
        !user.emailVerificationExpires ||
        user.emailVerificationExpires.getTime() < Date.now()
      ) {
        throw new UnauthorizedException(
          'Token xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.',
        );
      }
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
      this.logger.log(`Email ${user.email} verified successfully.`);
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.usersService.sanitizeUser(user),
    };
  }

  async requestResendVerificationEmail(email: string): Promise<void> {
    const emailLower = email.toLowerCase();
    const user = await this.usersService.findOneByEmail(emailLower);

    if (!user) {
      this.logger.warn(
        `Attempt to resend verification for non-existent email: ${emailLower}`,
      );
      return; // Bỏ qua để không lộ thông tin email
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email này đã được xác thực trước đó.');
    }

    user.emailVerificationToken = await this.generateSecureToken();
    const expiresInMsDefault = 86400000;
    const expiresInMs = parseInt(
      this.configService.get<string>(
        'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS',
        expiresInMsDefault.toString(),
      ),
      10,
    );
    user.emailVerificationExpires = new Date(Date.now() + expiresInMs);
    await user.save();

    try {
      if (!user.emailVerificationToken)
        throw new Error('Token missing for resend');
      await this.mailService.sendVerificationEmail(
        user.email,
        user.name,
        user.emailVerificationToken,
      );
      this.logger.log(`Resent verification email to ${user.email}`);
    } catch (emailError) {
      this.logger.error(
        `Failed to resend verification email to ${user.email}:`,
        emailError,
      );
      throw new InternalServerErrorException(
        'Không thể gửi lại email xác thực. Vui lòng thử lại sau.',
      );
    }
  }
}
