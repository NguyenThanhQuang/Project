import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsRepository } from './locations.repository';
import { LocationsService } from './locations.service';
import { Location, LocationType } from './schemas/location.schema';

const mockLocationId = new Types.ObjectId();

const mockLocationDoc = (mock?: Partial<Location>) => ({
  _id: mockLocationId,
  name: 'Bến xe Miền Đông',
  province: 'Hồ Chí Minh',
  fullAddress: '292 Đinh Bộ Lĩnh',
  type: LocationType.BUS_STATION,
  location: { type: 'Point', coordinates: [106.7, 10.8] },
  isActive: true,
  ...mock,
});

const mockLocationsRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  search: jest.fn(),
  findPopular: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: typeof mockLocationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: LocationsRepository, useValue: mockLocationsRepository },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get(LocationsRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= TEST CREATE =================
  describe('create', () => {
    const createDto: CreateLocationDto = {
      name: 'Bến xe Mới',
      province: 'Hà Nội',
      fullAddress: 'Giải Phóng',
      type: LocationType.BUS_STATION,
      location: { type: 'Point', coordinates: [105.8, 21.0] },
    };

    it('should create a location successfully', async () => {
      repository.findOne.mockResolvedValue(null);

      const newLocation = mockLocationDoc(createDto);
      repository.create.mockResolvedValue(newLocation);

      const result = await service.create(createDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        name: createDto.name,
        province: createDto.province,
      });
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if location exists', async () => {
      repository.findOne.mockResolvedValue(mockLocationDoc());

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ================= TEST FIND ALL =================
  describe('findAll', () => {
    it('should return array of locations', async () => {
      const mockLocations = [mockLocationDoc()];
      repository.findAll.mockResolvedValue(mockLocations);

      const result = await service.findAll();
      expect(result).toEqual(mockLocations);
    });
  });

  // ================= TEST SEARCH =================
  describe('search', () => {
    it('should return empty array if keyword is too short', async () => {
      const result = await service.search('a');
      expect(result).toEqual([]);
      expect(repository.search).not.toHaveBeenCalled();
    });

    it('should search with regex via repository', async () => {
      const keyword = 'Hồ Chí Minh';
      const mockResult = [mockLocationDoc()];
      repository.search.mockResolvedValue(mockResult);

      const result = await service.search(keyword);

      expect(repository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            expect.objectContaining({ name: expect.any(Object) }),
          ]),
        }),
        15,
      );
      expect(result).toEqual(mockResult);
    });
  });

  // ================= TEST FIND ONE =================
  describe('findOne', () => {
    it('should return location if found', async () => {
      const mockDoc = mockLocationDoc();
      repository.findById.mockResolvedValue(mockDoc);

      const result = await service.findOne(mockLocationId.toString());
      expect(result).toEqual(mockDoc);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(mockLocationId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= TEST UPDATE =================
  describe('update', () => {
    const updateDto: UpdateLocationDto = { name: 'Tên Mới' };

    it('should update successfully', async () => {
      const updatedDoc = mockLocationDoc({ name: 'Tên Mới' });
      repository.update.mockResolvedValue(updatedDoc);

      const result = await service.update(mockLocationId.toString(), updateDto);
      expect(result.name).toBe('Tên Mới');
      expect(repository.update).toHaveBeenCalledWith(
        mockLocationId.toString(),
        updateDto,
      );
    });

    it('should throw NotFoundException if not found', async () => {
      repository.update.mockResolvedValue(null);

      await expect(
        service.update(mockLocationId.toString(), updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ================= TEST REMOVE =================
  describe('remove', () => {
    it('should delete successfully', async () => {
      const deletedDoc = mockLocationDoc();
      repository.delete.mockResolvedValue(deletedDoc);

      const result = await service.remove(mockLocationId.toString());
      expect(result).toEqual(deletedDoc);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.delete.mockResolvedValue(null);

      await expect(service.remove(mockLocationId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= TEST POPULAR =================
  describe('findPopularLocations', () => {
    it('should return list of popular locations', async () => {
      const mockList = [mockLocationDoc(), mockLocationDoc()];
      repository.findPopular.mockResolvedValue(mockList);

      const result = await service.findPopularLocations();

      expect(repository.findPopular).toHaveBeenCalledWith(10);
      expect(result).toHaveLength(2);
    });
  });
});
