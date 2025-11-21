import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import {
  Company,
  CompanyDocument,
  CompanyStatus,
} from '../companies/schemas/company.schema';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenService } from './token/token.service';

// --- MOCKING MODULES ---
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// --- MOCKING DEPENDENCIES ---
const mockUsersService = {
  create: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneByPhone: jest.fn(),
  findOneByCondition: jest.fn(),
  sanitizeUser: jest.fn((user) => user), // Passthrough mock
};

const mockTokenService = {
  generateAccessToken: jest.fn(),
};

const mockEventEmitter = {
  emit: jest.fn(),
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

const mockUserDoc = (mock?: Partial<UserDocument>): Partial<UserDocument> => ({
  ...mock,
  save: jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  }),
  comparePassword: jest.fn().mockResolvedValue(true),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let eventEmitter: EventEmitter2;
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
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Company.name), useValue: mockCompanyModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
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

    it('should create new user and emit "user.registered" event', async () => {
      const createdUser = mockUserDoc({
        ...registerDto,
        emailVerificationToken: 'a-token',
      });
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'findOneByPhone').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser as any);

      await service.register(registerDto);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.registered',
        expect.any(Object),
      );
    });

    it('should emit "user.resend_verification" if user exists, not verified, and token is NOT expired', async () => {
      const unverifiedUser = mockUserDoc({
        ...registerDto,
        isEmailVerified: false,
        emailVerificationToken: 'existing-token',
        emailVerificationExpires: new Date(Date.now() + 100000),
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(unverifiedUser as any);
      jest.spyOn(usersService, 'findOneByPhone').mockResolvedValue(null);

      await service.register(registerDto);

      expect(unverifiedUser.save).not.toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.resend_verification',
        expect.any(Object),
      );
    });
  });

  // =================== LOGIN ===================
  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'test@example.com',
      password: 'password',
    };

    it('should successfully login with email and return token', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(mockUser as any);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue(
        'mockAccessToken',
      );

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mockAccessToken');
      expect(mockUser.save).toHaveBeenCalled(); // to update lastLoginDate
    });

    it('should throw ForbiddenException if user is banned', async () => {
      const bannedUser = mockUserDoc({ isBanned: true });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(bannedUser as any);

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw UnauthorizedException if company admin belongs to a suspended company', async () => {
      const companyAdmin = mockUserDoc({
        roles: [UserRole.COMPANY_ADMIN],
        companyId: new Types.ObjectId(),
      });
      const suspendedCompany = {
        _id: companyAdmin.companyId,
        status: CompanyStatus.SUSPENDED,
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(companyAdmin as any);
      jest.spyOn(companyModel, 'findById').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(suspendedCompany),
      } as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // =================== EMAIL VERIFICATION ===================
  describe('processEmailVerification', () => {
    it('should verify user and return token when token is valid', async () => {
      const token = 'valid-token';
      const unverifiedUser = mockUserDoc({
        isEmailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: new Date(Date.now() + 3600000),
      });
      jest
        .spyOn(usersService, 'findOneByCondition')
        .mockResolvedValue(unverifiedUser as any);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue(
        'mockAccessToken',
      );

      const result = await service.processEmailVerification(token);

      expect(unverifiedUser.save).toHaveBeenCalled();
      expect(result.accessToken).toBe('mockAccessToken');
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const token = 'expired-token';
      const userWithExpiredToken = mockUserDoc({
        isEmailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: new Date(Date.now() - 3600000),
      });
      jest
        .spyOn(usersService, 'findOneByCondition')
        .mockResolvedValue(userWithExpiredToken as any);

      await expect(service.processEmailVerification(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // =================== RESEND VERIFICATION ===================
  describe('requestResendVerificationEmail', () => {
    const testEmail = 'test@example.com';

    it('should emit "user.resend_verification" for an unverified user', async () => {
      const unverifiedUser = mockUserDoc({
        email: testEmail,
        name: 'Test',
        isEmailVerified: false,
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(unverifiedUser as any);

      await service.requestResendVerificationEmail(testEmail);

      expect(unverifiedUser.save).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.resend_verification',
        expect.any(Object),
      );
    });

    it('should throw BadRequestException if the user is already verified', async () => {
      const verifiedUser = mockUserDoc({
        email: testEmail,
        isEmailVerified: true,
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(verifiedUser as any);

      await expect(
        service.requestResendVerificationEmail(testEmail),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // =================== PASSWORD RESET ===================
  describe('Password Reset Flow', () => {
    const testEmail = 'verified@example.com';
    const forgotPasswordDto = { email: testEmail };

    it('should emit "user.forgot_password" for a verified user', async () => {
      const verifiedUser = mockUserDoc({
        email: testEmail,
        name: 'Verified User',
        isEmailVerified: true,
      });
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(verifiedUser as any);

      await service.requestPasswordReset(forgotPasswordDto);

      expect(verifiedUser.save).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.forgot_password',
        expect.any(Object),
      );
    });

    it('resetPasswordWithToken should change password with valid token', async () => {
      const resetDto: ResetPasswordDto = {
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
      jest.spyOn(userModel, 'findById').mockReturnValue({
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
  });

  // =================== COMPANY ADMIN ACTIVATION ===================
  describe('Company Admin Activation Flow', () => {
    it('activateCompanyAdminAccount should activate user and return token', async () => {
      const activateDto: ActivateAccountDto = {
        token: 'valid-token',
        newPassword: 'newPassword123!',
        confirmNewPassword: 'newPassword123!',
      };
      const userToActivate = mockUserDoc({
        accountActivationToken: 'valid-token',
        accountActivationExpires: new Date(Date.now() + 3600000),
      });

      jest.spyOn(userModel, 'findOne').mockResolvedValue(userToActivate as any);
      (tokenService.generateAccessToken as jest.Mock).mockReturnValue(
        'mockAccessToken',
      );

      const result = await service.activateCompanyAdminAccount(activateDto);

      expect(userToActivate.save).toHaveBeenCalled();
      expect(result.accessToken).toBe('mockAccessToken');
    });

    it('validateActivationToken should return company and user name for valid token', async () => {
      const companyId = new Types.ObjectId();
      const userToValidate = {
        name: 'Admin',
        companyId: { _id: companyId, name: 'Test Company' },
      };

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(userToValidate),
      } as any);

      const result = await service.validateActivationToken('valid-token');

      expect(result.isValid).toBe(true);
      expect(result.userName).toBe('Admin');
      expect(result.companyName).toBe('Test Company');
    });
  });
});
