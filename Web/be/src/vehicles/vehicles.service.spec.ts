import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { Trip } from '../trips/schemas/trip.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle, VehicleStatus } from './schemas/vehicle.schema';
import { VehiclesRepository } from './vehicles.repository'; // Import mới
import { VehiclesService } from './vehicles.service';

// --- MOCKS ---
const mockVehicleId = new Types.ObjectId();
const mockCompanyId = new Types.ObjectId();

// Mock Document (giữ nguyên logic save trả về this)
const mockVehicleDoc = (mock?: Partial<Vehicle> & { _id?: Types.ObjectId }) => {
  return {
    _id: mockVehicleId,
    vehicleNumber: '59B-12345',
    type: 'Limousine',
    companyId: mockCompanyId,
    floors: 1,
    seatRows: 3,
    seatColumns: 3,
    aislePositions: [2],
    totalSeats: 0,
    status: VehicleStatus.ACTIVE,
    ...mock,
    save: jest.fn().mockImplementation(function () {
      return Promise.resolve(this);
    }),
  };
};

// Mock Repository thay vì Model
const mockVehiclesRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn().mockImplementation((doc) => doc.save()),
};

const mockTripModel = {
  countDocuments: jest.fn(),
};

const mockCompaniesService = {
  findOne: jest.fn(),
};

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehiclesRepository: typeof mockVehiclesRepository;
  let tripModel: Model<Trip>;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: VehiclesRepository, useValue: mockVehiclesRepository }, // Inject Mock Repository
        { provide: getModelToken(Trip.name), useValue: mockTripModel },
        { provide: CompaniesService, useValue: mockCompaniesService },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    vehiclesRepository = module.get(VehiclesRepository);
    tripModel = module.get<Model<Trip>>(getModelToken(Trip.name));
    companiesService = module.get<CompaniesService>(CompaniesService);

    jest.clearAllMocks();
  });

  // ================= TEST CREATE =================
  describe('create', () => {
    const createDto: CreateVehicleDto = {
      companyId: mockCompanyId,
      vehicleNumber: '59B-99999',
      type: 'Bed',
      floors: 1,
      seatRows: 5,
      seatColumns: 3,
      aislePositions: [2],
    };

    it('should create a vehicle successfully', async () => {
      mockCompaniesService.findOne.mockResolvedValue({ _id: mockCompanyId });
      vehiclesRepository.findOne.mockResolvedValue(null);

      const newVehicle = mockVehicleDoc({ ...createDto });
      vehiclesRepository.create.mockResolvedValue(newVehicle);

      const result = await service.create(createDto);

      expect(companiesService.findOne).toHaveBeenCalledWith(mockCompanyId);
      expect(vehiclesRepository.findOne).toHaveBeenCalled();
      expect(vehiclesRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if vehicle number exists', async () => {
      mockCompaniesService.findOne.mockResolvedValue({ _id: mockCompanyId });
      vehiclesRepository.findOne.mockResolvedValue(mockVehicleDoc());

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ================= TEST FIND ONE =================
  describe('findOne', () => {
    it('should return vehicle if found', async () => {
      const mockVehicle = mockVehicleDoc();
      vehiclesRepository.findById.mockResolvedValue(mockVehicle);

      const result = await service.findOne(mockVehicleId.toString());
      expect(result).toEqual(mockVehicle);
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      vehiclesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(mockVehicleId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= TEST UPDATE =================
  describe('update', () => {
    const updateDto: UpdateVehicleDto = { vehicleNumber: '59B-88888' };

    const createFreshVehicle = () =>
      mockVehicleDoc({
        _id: mockVehicleId,
        vehicleNumber: '59B-OLD',
        companyId: mockCompanyId,
        floors: 1,
        seatRows: 3,
        seatColumns: 3,
        aislePositions: [2],
        totalSeats: 6,
      });

    it('should update simple fields successfully', async () => {
      const existingVehicle = createFreshVehicle();
      vehiclesRepository.findById.mockResolvedValue(existingVehicle);
      vehiclesRepository.findOne.mockResolvedValue(null); // No conflict

      const result = await service.update(mockVehicleId.toString(), updateDto);

      expect(vehiclesRepository.save).toHaveBeenCalledWith(existingVehicle);
      expect(result.vehicleNumber).toBe('59B-88888');
    });

    it('should throw ConflictException if new vehicle number exists', async () => {
      const existingVehicle = createFreshVehicle();
      vehiclesRepository.findById.mockResolvedValue(existingVehicle);
      vehiclesRepository.findOne.mockResolvedValue({
        _id: new Types.ObjectId(),
      }); // Conflict

      await expect(
        service.update(mockVehicleId.toString(), updateDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if changing structure while active trips exist', async () => {
      const existingVehicle = createFreshVehicle();
      const structUpdateDto: UpdateVehicleDto = { seatRows: 10 };

      vehiclesRepository.findById.mockResolvedValue(existingVehicle);

      // Mock trips count > 0 from TripModel (vẫn dùng Model trực tiếp ở đây)
      (tripModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(5),
      });

      await expect(
        service.update(mockVehicleId.toString(), structUpdateDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ================= TEST REMOVE =================
  describe('remove', () => {
    it('should soft delete vehicle if no active trips', async () => {
      const vehicleToRemove = mockVehicleDoc({ status: VehicleStatus.ACTIVE });
      vehiclesRepository.findById.mockResolvedValue(vehicleToRemove);

      (tripModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.remove(mockVehicleId.toString());

      expect(vehicleToRemove.status).toBe(VehicleStatus.INACTIVE);
      expect(vehiclesRepository.save).toHaveBeenCalledWith(vehicleToRemove);
    });

    it('should throw ConflictException if active trips exist', async () => {
      const vehicleToRemove = mockVehicleDoc({ status: VehicleStatus.ACTIVE });
      vehiclesRepository.findById.mockResolvedValue(vehicleToRemove);

      (tripModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      await expect(service.remove(mockVehicleId.toString())).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
