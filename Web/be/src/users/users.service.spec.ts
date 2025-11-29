import { NotFoundException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { TokenService } from '../auth/token/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

const mockUserId = new Types.ObjectId();
const mockCompanyId = new Types.ObjectId();

const mockUserDoc = (data?: Partial<User>): Partial<UserDocument> =>
  ({
    _id: mockUserId,
    email: 'test@example.com',
    name: 'Test User',
    phone: '0123456789',
    roles: [UserRole.USER],
    ...data,
    toObject: jest.fn().mockReturnValue({
      _id: mockUserId,
      email: 'test@example.com',
      name: 'Test User',
      phone: '0123456789',
      roles: [UserRole.USER],
      ...data,
    }),
    save: jest.fn().mockResolvedValue(data),
  }) as any;

const mockUsersRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
};

const mockTokenService = {
  generateRandomToken: jest.fn(),
};

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

const mockConnection = {
  startSession: jest.fn().mockResolvedValue(mockSession),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: typeof mockUsersRepository;
  let tokenService: typeof mockTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: getConnectionToken(), useValue: mockConnection },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
    tokenService = module.get(TokenService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= TEST CREATE =================
  describe('create', () => {
    it('should call repository.create and return the result', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@test.com',
        name: 'New User',
        phone: '0987654321',
        password: 'password',
      };
      const expectedUser = mockUserDoc(createUserDto);

      repository.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });

  // ================= TEST FIND BY ID =================
  describe('findById', () => {
    it('should return user if found', async () => {
      const user = mockUserDoc();
      repository.findById.mockResolvedValue(user);

      const result = await service.findById(mockUserId.toString());
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('some-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= TEST UPDATE =================
  describe('update', () => {
    it('should update and return user if found', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = mockUserDoc({ name: 'Updated Name' });

      repository.update.mockResolvedValue(updatedUser);

      const result = await service.update(mockUserId.toString(), updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        mockUserId.toString(),
        updateDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user to update not found', async () => {
      repository.update.mockResolvedValue(null);

      await expect(service.update('some-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= TEST SANITIZE USER =================
  describe('sanitizeUser', () => {
    it('should remove sensitive fields', () => {
      const userWithSecrets = mockUserDoc({
        passwordHash: 'secret',
        emailVerificationToken: 'token',
      } as any);

      (userWithSecrets.toObject as jest.Mock).mockReturnValue({
        _id: mockUserId,
        name: 'Test',
        passwordHash: 'secret',
        emailVerificationToken: 'token',
      });

      const result = service.sanitizeUser(userWithSecrets as any);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('emailVerificationToken');
      expect(result).toHaveProperty('name', 'Test');
    });
  });

  // ================= TEST TRANSACTION: createOrPromoteCompanyAdmin =================
  describe('createOrPromoteCompanyAdmin', () => {
    const payload = {
      name: 'Admin',
      email: 'admin@company.com',
      phone: '0123456789',
      companyId: mockCompanyId,
    };

    it('should PROMOTE existing user to COMPANY_ADMIN if user exists', async () => {
      const existingUser = mockUserDoc({
        email: payload.email,
        roles: [UserRole.USER],
      });
      repository.findOne.mockResolvedValue(existingUser);

      const result = await service.createOrPromoteCompanyAdmin(payload);

      expect(mockConnection.startSession).toHaveBeenCalled();
      expect(mockSession.startTransaction).toHaveBeenCalled();

      expect(existingUser.roles).toContain(UserRole.COMPANY_ADMIN);
      expect(existingUser.companyId).toEqual(mockCompanyId);
      expect(repository.save).toHaveBeenCalledWith(existingUser, mockSession);

      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
      expect(result.isNew).toBe(false);
    });

    it('should CREATE new user as COMPANY_ADMIN if user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const mockToken = 'random-activation-token';
      tokenService.generateRandomToken.mockReturnValue(mockToken);

      const newUser = mockUserDoc({
        email: payload.email,
        roles: [UserRole.COMPANY_ADMIN],
      });
      repository.create.mockResolvedValue(newUser);

      const result = await service.createOrPromoteCompanyAdmin(payload);

      expect(tokenService.generateRandomToken).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          accountActivationToken: mockToken,
          roles: [UserRole.COMPANY_ADMIN],
        }),
        mockSession,
      );

      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(result.isNew).toBe(true);
    });

    it('should ROLLBACK transaction if an error occurs', async () => {
      repository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createOrPromoteCompanyAdmin(payload),
      ).rejects.toThrow('Database error');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
      expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    });
  });
});
