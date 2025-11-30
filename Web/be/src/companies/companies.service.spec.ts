import { ConflictException, NotFoundException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './schemas/company.schema';

const mockCompanyId = new Types.ObjectId();
const mockCompanyDoc = (data?: Partial<Company>) => ({
  _id: mockCompanyId,
  name: 'Test Bus',
  code: 'TESTBUS',
  ...data,
});

const mockCompaniesRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getCompanyStats: jest.fn(),
};

const mockUsersService = {
  createOrPromoteCompanyAdmin: jest.fn(),
};

const mockMailService = {
  sendCompanyAdminActivationEmail: jest.fn(),
  sendCompanyAdminPromotionEmail: jest.fn(),
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

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: typeof mockCompaniesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: CompaniesRepository, useValue: mockCompaniesRepository },
        { provide: getConnectionToken(), useValue: mockConnection },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get(CompaniesRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= TEST CREATE =================
  describe('create', () => {
    const createDto: CreateCompanyDto = {
      name: 'Phuong Trang',
      code: 'FUTA',
      adminName: 'Admin Futa',
      adminEmail: 'admin@futa.com',
      adminPhone: '0909000000',
    };

    it('should throw ConflictException if company name exists', async () => {
      repository.findOne.mockResolvedValueOnce(mockCompanyDoc());
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if company code exists', async () => {
      repository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockCompanyDoc());

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create company and transaction successfully', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockCompanyDoc(createDto));

      mockUsersService.createOrPromoteCompanyAdmin.mockResolvedValue({
        user: { email: 'test', name: 'test', accountActivationToken: 'token' },
        isNew: true,
      });

      await service.create(createDto);

      expect(mockConnection.startSession).toHaveBeenCalled();
      expect(mockSession.startTransaction).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });
  });

  // ================= TEST FIND ONE =================
  describe('findOne', () => {
    it('should return a company if found', async () => {
      repository.findById.mockResolvedValue(mockCompanyDoc());
      const result = await service.findOne(mockCompanyId.toString());
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne(mockCompanyId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= TEST UPDATE =================
  describe('update', () => {
    const updateDto: UpdateCompanyDto = { name: 'New Name', code: 'NEWCODE' };

    it('should update successfully', async () => {
      const existingCompany = mockCompanyDoc({ name: 'Old', code: 'OLD' });
      repository.findById.mockResolvedValue(existingCompany);

      repository.findOne.mockResolvedValue(null);

      repository.save.mockImplementation((doc) => Promise.resolve(doc));

      const result = await service.update(mockCompanyId.toString(), updateDto);

      expect(result.name).toBe('New Name');
      expect(result.code).toBe('NEWCODE');

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Name', code: 'NEWCODE' }),
      );
    });
  });

  // ================= TEST STATS =================
  describe('findAllWithStats', () => {
    it('should call repository.getCompanyStats', async () => {
      const mockStats = [{ total: 10 }];
      repository.getCompanyStats.mockResolvedValue(mockStats);

      const result = await service.findAllWithStats();
      expect(result).toEqual(mockStats);
      expect(repository.getCompanyStats).toHaveBeenCalled();
    });
  });
});
