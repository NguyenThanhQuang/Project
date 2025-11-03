import { ConflictException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { TripStatus } from '../trips/schemas/trip.schema';
import { VehicleStatus } from './schemas/vehicle.schema';

jest.mock('../companies/companies.service', () => ({
  CompaniesService: class {},
}));

type ExecReturn<T> = { exec: jest.Mock<Promise<T>, []> };

const execResolved = <T>(value: T): ExecReturn<T> => ({
  exec: jest.fn().mockResolvedValue(value),
});

const buildVehicle = (overrides: Record<string, unknown> = {}) => {
  const vehicle = {
    _id: 'vehicle-id',
    companyId: 'company-id',
    vehicleNumber: 'OLD-001',
    floors: 1,
    seatRows: 2,
    seatColumns: 2,
    aislePositions: [],
    totalSeats: 4,
    seatMap: {
      rows: 2,
      cols: 2,
      layout: [
        ['A01', 'A02'],
        ['A03', 'A04'],
      ],
    },
    seatMapFloor2: undefined as unknown,
    status: VehicleStatus.ACTIVE,
    save: jest.fn(),
    ...overrides,
  };

  (vehicle.save as jest.Mock).mockResolvedValue(vehicle);
  return vehicle;
};

describe('VehiclesService update & remove', () => {
  let service: VehiclesService;
  let vehicleModel: { findOne: jest.Mock };
  let tripModel: { countDocuments: jest.Mock };
  let companiesService: { findOne: jest.Mock };

  beforeEach(() => {
    vehicleModel = {
      findOne: jest.fn(),
    } as any;

    tripModel = {
      countDocuments: jest.fn(),
    } as any;

    companiesService = {
      findOne: jest.fn(),
    };

    service = new VehiclesService(
      vehicleModel as any,
      tripModel as any,
      companiesService as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('update', () => {
    it('throws ConflictException when the new vehicle number already exists', async () => {
      const existingVehicle = buildVehicle();
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingVehicle as unknown as any);

      vehicleModel.findOne.mockReturnValue(execResolved({ _id: 'other-id' }));

      await expect(
        service.update(existingVehicle._id, {
          vehicleNumber: 'dup-001',
        } as any),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(vehicleModel.findOne).toHaveBeenCalledWith({
        companyId: existingVehicle.companyId,
        vehicleNumber: 'DUP-001',
        _id: { $ne: existingVehicle._id },
      });
    });

    it('recomputes seat maps and uppercases the vehicle number when structure changes without conflicts', async () => {
      const existingVehicle = buildVehicle();
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingVehicle as unknown as any);

      vehicleModel.findOne.mockReturnValue(execResolved(null));
      tripModel.countDocuments.mockReturnValue(execResolved(0));

      const result = await service.update(existingVehicle._id, {
        seatRows: 3,
        seatColumns: 2,
        aislePositions: [],
        floors: 1,
        vehicleNumber: 'new-001',
      } as any);

      expect(tripModel.countDocuments).toHaveBeenCalledWith({
        vehicleId: existingVehicle._id,
        status: {
          $in: [TripStatus.SCHEDULED, TripStatus.DEPARTED],
        },
      });
      expect(existingVehicle.totalSeats).toBe(6);
      expect(existingVehicle.seatMap.rows).toBe(3);
      expect(existingVehicle.seatMap.layout[0][0]).toBe('A01');
      expect(existingVehicle.seatMapFloor2).toBeUndefined();
      expect(existingVehicle.vehicleNumber).toBe('NEW-001');
      expect(existingVehicle.save).toHaveBeenCalledTimes(1);
      expect(result).toBe(existingVehicle);
    });

    it('throws ConflictException when structural changes are attempted with upcoming trips', async () => {
      const existingVehicle = buildVehicle();
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingVehicle as unknown as any);

      vehicleModel.findOne.mockReturnValue(execResolved(null));
      tripModel.countDocuments.mockReturnValue(execResolved(2));

      await expect(
        service.update(existingVehicle._id, {
          seatRows: 5,
        } as any),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(existingVehicle.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('throws ConflictException when the vehicle still has upcoming trips', async () => {
      const existingVehicle = buildVehicle();
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingVehicle as unknown as any);

      tripModel.countDocuments.mockReturnValue(execResolved(1));

      await expect(service.remove(existingVehicle._id)).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(existingVehicle.status).toBe(VehicleStatus.ACTIVE);
      expect(existingVehicle.save).not.toHaveBeenCalled();
    });

    it('marks the vehicle as inactive when removal succeeds', async () => {
      const existingVehicle = buildVehicle();
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingVehicle as unknown as any);

      tripModel.countDocuments.mockReturnValue(execResolved(0));

      const result = await service.remove(existingVehicle._id);

      expect(tripModel.countDocuments).toHaveBeenCalledWith({
        vehicleId: existingVehicle._id,
        status: {
          $in: [TripStatus.SCHEDULED, TripStatus.DEPARTED],
        },
      });
      expect(existingVehicle.status).toBe(VehicleStatus.INACTIVE);
      expect(existingVehicle.save).toHaveBeenCalledTimes(1);
      expect(result).toBe(existingVehicle);
    });
  });
});
