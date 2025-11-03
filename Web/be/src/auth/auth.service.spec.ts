import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { MailService } from '../mail/mail.service';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token/token.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// --- Mocking all Dependencies ---
const mockUsersService = {
  create: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneByPhone: jest.fn(),
  findOneByCondition: jest.fn(),
  sanitizeUser: jest.fn((user) => user),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: any) => {
    const values = {
      EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS: '86400000',
      PASSWORD_RESET_TOKEN_EXPIRES_IN_MS: '3600000',
    };
    return values[key] || defaultValue;
  }),
};

const mockUserModel = { findOne: jest.fn(), findById: jest.fn() };

const mockCompanyModel = { findById: jest.fn() };

const mockTokenService = {
  generateAccessToken: jest.fn(),
};

// --- Mock Mongoose Document Methods ---
const mockUserDoc = (mock?: Partial<UserDocument>): Partial<UserDocument> => ({
  ...mock,
  save: jest.fn().mockResolvedValue(mock),
  comparePassword: jest.fn().mockResolvedValue(true),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let mailService: MailService;
  let tokenService: TokenService;
  let userModel: Model<UserDocument>;
  let companyModel: Model<CompanyDocument>;

  const mockUser = mockUserDoc({
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    name: 'Test User',
    phone: '0123456789',
    isEmailVerified: true,
    isBanned: false,
    roles: [UserRole.USER],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Company.name), useValue: mockCompanyModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    tokenService = module.get<TokenService>(TokenService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    companyModel = module.get<Model<CompanyDocument>>(
      getModelToken(Company.name),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =================== REGISTER ===================
  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'new@example.com',
      phone: '0123456780',
      password: 'password',
      name: 'New User',
    };

    it('should create new user and send verification email', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'findOneByPhone').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(
        mockUserDoc({
          ...registerDto,
          emailVerificationToken: 'a-token',
        }) as any,
      );

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
      expect(result.message).toContain('Đăng ký thành công');
    });

    it('should throw ConflictException if phone is already taken', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest
        .spyOn(usersService, 'findOneByPhone')
        .mockResolvedValue(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should resend email if user exists, not verified, and token is NOT expired', async () => {
      const unverifiedUser = mockUserDoc({
        isEmailVerified: false,
        emailVerificationToken: 'existing-token',
        emailVerificationExpires: new Date(Date.now() + 100000),
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(unverifiedUser as any);

      const result = await service.register(registerDto);

      expect(unverifiedUser.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
      expect(result.message).toContain('Một email xác thực mới đã được gửi');
    });

    it('should generate NEW token and resend email if user exists, not verified, and token IS expired', async () => {
      const unverifiedUser = mockUserDoc({
        isEmailVerified: false,
        emailVerificationToken: 'expired-token',
        emailVerificationExpires: new Date(Date.now() - 100000),
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(unverifiedUser as any);

      const result = await service.register(registerDto);

      expect(unverifiedUser.save).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
      expect(result.message).toContain('Một email xác thực mới đã được gửi');
    });
  });

  // =================== LOGIN ===================
  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'test@example.com',
      password: 'password',
    };

    it('should successfully login with email', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue('mockAccessToken');

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.user).toBeDefined();
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginDto.password);
    });

    it('should successfully login with phone number', async () => {
      const loginDtoPhone: LoginDto = {
        identifier: '0123456789',
        password: 'password',
      };
      jest
        .spyOn(usersService, 'findOneByPhone')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue('mockAccessToken');

      const result = await service.login(loginDtoPhone);

      expect(result.accessToken).toBe('mockAccessToken');
      expect(usersService.findOneByEmail).not.toHaveBeenCalled();
      expect(usersService.findOneByPhone).toHaveBeenCalledWith(
        loginDtoPhone.identifier,
      );
    });

    it('should throw UnauthorizedException for wrong credentials', async () => {
      const userWithWrongPass = mockUserDoc({
        comparePassword: jest.fn().mockResolvedValue(false),
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(userWithWrongPass as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // =================== FORGOT/RESET PASSWORD ===================
  describe('Password Reset Flow', () => {
    it('requestPasswordReset should send an email if user exists', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(mockUser as any);

      const result = await service.requestPasswordReset({
        email: mockUser.email!,
      });

      expect(mockUser.save).toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(result.message).toContain('bạn sẽ nhận được một email');
    });

    it('requestPasswordReset should NOT throw error for non-existent user', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        service.requestPasswordReset({ email: 'notfound@test.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('resetPasswordWithToken should change password with valid token', async () => {
      const resetDto = {
        token: 'valid-token',
        newPassword: 'newPassword123!',
        confirmNewPassword: 'newPassword123!',
      };
      const userWithToken = mockUserDoc({
        passwordResetToken: 'valid-token',
        passwordResetExpires: new Date(Date.now() + 3600000),
      });

      jest
        .spyOn(usersService, 'findOneByCondition')
        .mockResolvedValue(userWithToken as any);
      jest.spyOn(mockUserModel, 'findById').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ passwordHash: 'oldHash' }),
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.resetPasswordWithToken(resetDto);

      expect(userWithToken.save).toHaveBeenCalled();
      expect(result.message).toBe(
        'Mật khẩu của bạn đã được đặt lại thành công.',
      );
    });

    it('resetPasswordWithToken should throw BadRequestException if new password is same as old', async () => {
      const resetDto = {
        token: 'valid-token',
        newPassword: 'oldPassword123!',
        confirmNewPassword: 'oldPassword123!',
      };
      const userWithToken = mockUserDoc({
        passwordResetToken: 'valid-token',
        passwordResetExpires: new Date(Date.now() + 3600000),
      });

      jest
        .spyOn(usersService, 'findOneByCondition')
        .mockResolvedValue(userWithToken as any);
      jest.spyOn(mockUserModel, 'findById').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ passwordHash: 'oldHash' }),
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.resetPasswordWithToken(resetDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPasswordWithToken(resetDto)).rejects.toThrow(
        'Mật khẩu mới không được trùng với mật khẩu cũ.',
      );
    });
  });
});
