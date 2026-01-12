import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import {
  Company,
  CompanyDocument,
  CompanyStatus,
} from 'src/companies/schemas/company.schema';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  SanitizedUser,
  User,
  UserDocument,
  UserRole,
} from '../users/schemas/user.schema';
import {
  InternalCreateUserPayload,
  UsersService,
} from '../users/users.service';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { Driver, DriverDocument, DriverStatus } from 'src/drivers/schema/driver.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Driver.name)
private driverModel: Model<DriverDocument>,

    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  private generateSecureToken(length: number = 32): string {
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
            this.generateSecureToken();
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
      throw new ConflictException('Địa chỉ email này đã được sử dụng.');
    }

    const existingUserByPhone = await this.usersService.findOneByPhone(
      registerDto.phone,
    );
    if (existingUserByPhone) {
      throw new ConflictException('Số điện thoại này đã được sử dụng.');
    }

    const emailVerificationToken = this.generateSecureToken();
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
      if (error instanceof ConflictException) {
        throw error;
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: any }).code === 11000
      ) {
        this.logger.warn(
          `MongoDB duplicate key error on user creation: ${(error as Error).message}`,
        );
        throw new ConflictException(
          'Thông tin cung cấp bị trùng lặp. Vui lòng kiểm tra lại.',
        );
      }

      this.logger.error('Unhandled error during user creation:', error);

      throw new InternalServerErrorException(
        'Không thể tạo tài khoản do lỗi hệ thống. Vui lòng thử lại sau.',
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
  password: string,
): Promise<UserDocument> {
  // 1️⃣ Validate input
  if (!identifier || !password) {
    throw new BadRequestException(
      'Email/Số điện thoại và mật khẩu là bắt buộc',
    );
  }

  const identifierTrimmed = identifier.trim();

  let user: UserDocument | null = null;

  // 2️⃣ Xác định là email hay phone
  if (isEmail(identifierTrimmed)) {
    const emailLower = identifierTrimmed.toLowerCase();
    user = await this.usersService.findOneByEmail(emailLower);
  } else {
    user = await this.usersService.findOneByPhone(identifierTrimmed);
  }

  // 3️⃣ Không tìm thấy user
  if (!user) {
    throw new UnauthorizedException(
      'Email/Số điện thoại hoặc mật khẩu không chính xác',
    );
  }

  // 4️⃣ So sánh mật khẩu
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedException(
      'Email/Số điện thoại hoặc mật khẩu không chính xác',
    );
  }

  return user;
}

async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: SanitizedUser }> {
    const user = await this.validateUser(
      loginDto.identifier,
      loginDto.password,
    );

    // 1) Check user bị khoá
    if (user.isBanned) {
      this.logger.warn(`Login attempt for BANNED user: ${user.email}`);
      throw new ForbiddenException(
        'Tài khoản hiện tại đang bị tạm ngưng. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
      );
    }

    // 2) Update lastLoginDate (không await để tránh chậm)
    user.lastLoginDate = new Date();
    user
      .save()
      .catch((err) =>
        this.logger.error('Failed to update last login date', err),
      );

    // 3) Check email verified
    if (!user.isEmailVerified) {
      this.logger.warn(`Login attempt for unverified email: ${user.email}`);
      throw new UnauthorizedException(
        'Tài khoản của bạn chưa được xác thực qua email. Vui lòng kiểm tra email hoặc yêu cầu gửi lại liên kết xác thực.',
      );
    }

    // 4) Nếu là COMPANY_ADMIN → check company status
    if (user.roles.includes(UserRole.COMPANY_ADMIN)) {
      if (!user.companyId) {
        throw new UnauthorizedException(
          'Tài khoản quản trị viên này không được liên kết với nhà xe nào.',
        );
      }

      const company = await this.companyModel
        .findById(user.companyId)
        .select('status')
        .exec();

      if (!company || company.status !== CompanyStatus.ACTIVE) {
        throw new UnauthorizedException(
          `Không thể đăng nhập. Nhà xe đang ở trạng thái "${
            company?.status || 'không tồn tại'
          }".`,
        );
      }
    }

    // 5) ✅ Nếu là DRIVER → check driver status
    if (user.roles.includes(UserRole.DRIVER)) {
      if (!user.driverId) {
        throw new UnauthorizedException(
          'Tài khoản tài xế chưa được liên kết với hồ sơ tài xế.',
        );
      }

      const driver = await this.driverModel
        .findById(user.driverId)
        .select('status companyId')
        .exec();

      if (!driver) {
        throw new UnauthorizedException('Không tìm thấy hồ sơ tài xế.');
      }

      if (driver.status !== DriverStatus.ACTIVE) {
        throw new ForbiddenException(
          'Tài khoản hiện tại đang bị tạm ngưng. Vui lòng liên hệ nhà xe để được hỗ trợ.',
        );
      }

      // (Khuyến nghị) nếu muốn chặt hơn: check company của driver cũng ACTIVE
      if (driver.companyId) {
        const company = await this.companyModel
          .findById(driver.companyId)
          .select('status')
          .exec();

        if (!company || company.status !== CompanyStatus.ACTIVE) {
          throw new UnauthorizedException(
            'Không thể đăng nhập. Nhà xe đang bị tạm ngưng hoặc không tồn tại.',
          );
        }
      }
    }

    // 6) Sign JWT
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      roles: user.roles,
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
      roles: user.roles,
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

    user.emailVerificationToken = this.generateSecureToken();
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
      throw new NotFoundException(
        'Không tìm thấy tài khoản nào được liên kết với địa chỉ email này.',
      );
    }

    if (!user.isEmailVerified) {
      this.logger.warn(
        `Password reset requested for unverified email: ${email}`,
      );
      return { message: generalSuccessMessage };
    }

    user.passwordResetToken = this.generateSecureToken();
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
      throw new InternalServerErrorException(
        'Không thể gửi email đặt lại mật khẩu vào lúc này.',
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

    const userWithPassword = await this.userModel
      .findById(user._id)
      .select('+passwordHash')
      .exec();

    if (userWithPassword && userWithPassword.passwordHash) {
      const isSameAsOldPassword = await bcrypt.compare(
        newPassword,
        userWithPassword.passwordHash,
      );
      if (isSameAsOldPassword) {
        throw new BadRequestException(
          'Mật khẩu mới không được trùng với mật khẩu cũ.',
        );
      }
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

  async activateCompanyAdminAccount(
    activateDto: ActivateAccountDto,
  ): Promise<{ accessToken: string; user: SanitizedUser }> {
    const { token, newPassword, confirmNewPassword } = activateDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp.',
      );
    }

    const user = await this.userModel.findOne({
      accountActivationToken: token,
      accountActivationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException(
        'Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
      );
    }

    user.passwordHash = newPassword;
    user.isEmailVerified = true;
    user.accountActivationToken = undefined;
    user.accountActivationExpires = undefined;
    user.lastLoginDate = new Date();

    await user.save();

    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      roles: user.roles,
      companyId: user.companyId?.toString(),
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.usersService.sanitizeUser(user),
    };
  }

  async validateActivationToken(token: string): Promise<{
    isValid: boolean;
    message?: string;
    userName?: string;
    companyName?: string;
  }> {
    if (!token) {
      return { isValid: false, message: 'Token không được cung cấp.' };
    }

    const user = await this.userModel
      .findOne({
        accountActivationToken: token,
        accountActivationExpires: { $gt: new Date() },
      })
      .populate('companyId', 'name');

    if (!user) {
      return { isValid: false, message: 'Token không hợp lệ hoặc đã hết hạn.' };
    }

    const companyName = (user.companyId as any)?.name || 'Không xác định';

    return { isValid: true, userName: user.name, companyName: companyName };
  }
}
