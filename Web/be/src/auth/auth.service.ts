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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
    const expiresInMsDefault = 86400000;
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
          `MongoDB duplicate key error during user creation for email ${emailLower} or phone ${registerDto.phone}. Error: ${error.message}`,
        );
        throw new ConflictException(
          'Không thể tạo tài khoản do lỗi dữ liệu trùng lặp. Vui lòng thử lại.',
        );
      }
      throw new InternalServerErrorException(
        'Không thể tạo tài khoản. Vui lòng thử lại sau.',
      );
    }

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
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
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
      companyId: user.companyId?.toString(),
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
      return;
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
      if (!user.emailVerificationToken) {
        this.logger.error(
          `Critical: Token for resend missing for ${user.email}`,
        );
        throw new InternalServerErrorException(
          'Lỗi hệ thống khi chuẩn bị gửi lại email.',
        );
      }
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

  async requestPasswordReset(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const email = forgotPasswordDto.email.toLowerCase();
    const user = await this.usersService.findOneByEmail(email);

    const generalSuccessMessage =
      'Nếu địa chỉ email của bạn tồn tại trong hệ thống và đã được xác thực, bạn sẽ nhận được một email hướng dẫn đặt lại mật khẩu trong vài phút nữa.';

    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
      return { message: generalSuccessMessage };
    }

    if (!user.isEmailVerified) {
      this.logger.warn(
        `Password reset requested for unverified email: ${email}`,
      );
      return { message: generalSuccessMessage };
    }

    user.passwordResetToken = await this.generateSecureToken();
    const expiresInMs = parseInt(
      this.configService.get<string>(
        'PASSWORD_RESET_TOKEN_EXPIRES_IN_MS',
        '3600000',
      ),
      10,
    );
    user.passwordResetExpires = new Date(Date.now() + expiresInMs);

    try {
      await user.save();
      if (!user.passwordResetToken) {
        this.logger.error(
          `Critical error: Password reset token missing for user ${user.email} after save, before sending mail.`,
        );
        throw new InternalServerErrorException(
          'Lỗi hệ thống khi tạo token đặt lại mật khẩu.',
        );
      }
      await this.mailService.sendPasswordResetEmail(
        user.email,
        user.name,
        user.passwordResetToken,
      );
      this.logger.log(
        `Password reset process initiated for ${user.email}. Token: ${user.passwordResetToken}`,
      );
    } catch (error) {
      this.logger.error(
        `Error during password reset process for ${user.email}:`,
        error,
      );
    }
    return { message: generalSuccessMessage };
  }

  async resetPasswordWithToken(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword, confirmNewPassword } = resetPasswordDto;
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp.',
      );
    }

    const user = await this.usersService.findOneByCondition({
      passwordResetToken: token,
    });

    if (!user) {
      throw new BadRequestException(
        'Token đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.',
      );
    }

    if (
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw new BadRequestException(
        'Token đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.',
      );
    }

    user.passwordHash = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    try {
      await user.save();
      this.logger.log(`Password reset successfully for user ${user.email}.`);
    } catch (error) {
      this.logger.error(
        `Error saving user after password reset for ${user.email}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.',
      );
    }

    return { message: 'Mật khẩu của bạn đã được đặt lại thành công.' };
  }

  async validatePasswordResetToken(
    token: string,
  ): Promise<{ isValid: boolean; message?: string; email?: string }> {
    if (!token || typeof token !== 'string') {
      return { isValid: false, message: 'Token không được cung cấp.' };
    }
    const user = await this.usersService.findOneByCondition({
      passwordResetToken: token,
    });

    if (!user) {
      return {
        isValid: false,
        message: 'Token không hợp lệ hoặc đã được sử dụng.',
      };
    }

    if (
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      return { isValid: false, message: 'Token đã hết hạn.' };
    }

    return { isValid: true, email: user.email };
  }
}
