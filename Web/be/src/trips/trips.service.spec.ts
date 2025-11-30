import { BadRequestException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Booking, BookingStatus } from '../bookings/schemas/booking.schema';
import { CompaniesService } from '../companies/companies.service';
import { CompanyStatus } from '../companies/schemas/company.schema';
import { LocationsService } from '../locations/locations.service';
import { MapsService } from '../maps/maps.service';
import { Review } from '../reviews/schemas/review.schema';
import { VehicleStatus } from '../vehicles/schemas/vehicle.schema';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import {
  SeatStatus,
  Trip,
  TripStatus,
  TripStopStatus,
} from './schemas/trip.schema';
import { TripsRepository } from './trips.repository'; // Import mới
import { TripsService } from './trips.service';

// --- MOCKS CONSTANTS ---
const mockTripId = new Types.ObjectId();
const mockCompanyId = new Types.ObjectId();
const mockVehicleId = new Types.ObjectId();
const mockFromLocationId = new Types.ObjectId();
const mockToLocationId = new Types.ObjectId();
const mockBookingId = new Types.ObjectId();

// --- MOCK DOCUMENTS ---
const mockTripDoc = (mock?: Partial<Trip>) => ({
  _id: mockTripId,
  companyId: { _id: mockCompanyId, status: CompanyStatus.ACTIVE },
  vehicleId: {
    _id: mockVehicleId,
    status: VehicleStatus.ACTIVE,
    seatMap: {},
    totalSeats: 10,
  },
  route: {
    fromLocationId: mockFromLocationId,
    toLocationId: mockToLocationId,
    stops: [],
  },
  departureTime: new Date(),
  expectedArrivalTime: new Date(Date.now() + 3600000),
  price: 100000,
  status: TripStatus.SCHEDULED,
  seats: [{ seatNumber: 'A01', status: SeatStatus.AVAILABLE }],
  ...mock,
  save: jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  }),
  deleteOne: jest.fn().mockResolvedValue(true),
  toObject: jest.fn().mockReturnThis(),
});

// --- MOCK SERVICES ---
const mockCompaniesService = { findOne: jest.fn() };
const mockVehiclesService = { findOne: jest.fn() };
const mockLocationsService = { findOne: jest.fn() };
const mockMapsService = { getRouteInfo: jest.fn() };
const mockEventEmitter = { emit: jest.fn() };

// --- MOCK REPOSITORY ---
const mockTripsRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdWithDetails: jest.fn(),
  findPublicTrips: jest.fn(),
  findManagementTrips: jest.fn(),
  save: jest.fn().mockImplementation((doc) => doc.save()),
};

const mockBookingModel = {
  find: jest.fn(),
  aggregate: jest.fn(),
  countDocuments: jest.fn(),
};

const mockReviewModel = {
  aggregate: jest.fn(),
};

// --- MOCK CONNECTION (TRANSACTION) ---
const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};
const mockConnection = {
  startSession: jest.fn().mockResolvedValue(mockSession),
};

describe('TripsService', () => {
  let service: TripsService;
  let tripsRepository: typeof mockTripsRepository;
  let bookingModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: TripsRepository, useValue: mockTripsRepository }, // Inject Mock Repository
        { provide: getModelToken(Booking.name), useValue: mockBookingModel },
        { provide: getModelToken(Review.name), useValue: mockReviewModel },
        { provide: getConnectionToken(), useValue: mockConnection },
        { provide: CompaniesService, useValue: mockCompaniesService },
        { provide: VehiclesService, useValue: mockVehiclesService },
        { provide: LocationsService, useValue: mockLocationsService },
        { provide: MapsService, useValue: mockMapsService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
    tripsRepository = module.get(TripsRepository);
    bookingModel = module.get(getModelToken(Booking.name));

    jest.clearAllMocks();
  });

  // ================= TEST CREATE =================
  describe('create', () => {
    const createDto: CreateTripDto = {
      companyId: mockCompanyId as any,
      vehicleId: mockVehicleId as any,
      route: {
        fromLocationId: mockFromLocationId as any,
        toLocationId: mockToLocationId as any,
        stops: [],
      },
      departureTime: new Date(Date.now() + 86400000).toISOString(),
      expectedArrivalTime: new Date(Date.now() + 90000000).toISOString(),
      price: 200000,
    };

    it('should create a trip successfully', async () => {
      mockCompaniesService.findOne.mockResolvedValue({
        _id: mockCompanyId,
        status: CompanyStatus.ACTIVE,
      });
      mockVehiclesService.findOne.mockResolvedValue({
        _id: mockVehicleId,
        status: VehicleStatus.ACTIVE,
        companyId: { _id: mockCompanyId },
        totalSeats: 10,
        seatMap: { layout: [['A01', 'A02']] },
      });
      mockLocationsService.findOne.mockResolvedValue({
        location: { coordinates: [0, 0] },
      });
      mockMapsService.getRouteInfo.mockResolvedValue({
        polyline: 'poly',
        duration: 100,
        distance: 1000,
      });

      tripsRepository.findOne.mockResolvedValue(null);
      tripsRepository.create.mockResolvedValue(mockTripDoc());

      const result = await service.create(createDto);

      expect(mockCompaniesService.findOne).toHaveBeenCalled();
      expect(mockVehiclesService.findOne).toHaveBeenCalled();
      expect(mockMapsService.getRouteInfo).toHaveBeenCalled();
      expect(tripsRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequest if vehicle is not active', async () => {
      mockCompaniesService.findOne.mockResolvedValue({
        _id: mockCompanyId,
        status: CompanyStatus.ACTIVE,
      });
      mockVehiclesService.findOne.mockResolvedValue({
        _id: mockVehicleId,
        status: VehicleStatus.MAINTENANCE,
      });
      mockLocationsService.findOne.mockResolvedValue({});

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ================= TEST FIND PUBLIC TRIPS =================
  describe('findPublicTrips', () => {
    it('should return populated trips with seats count', async () => {
      const query = { from: 'hcm', to: 'hn', date: '2023-12-01' };
      const mockTrip = mockTripDoc({
        companyId: { _id: mockCompanyId, status: CompanyStatus.ACTIVE } as any,
        route: {
          fromLocationId: { province: 'hcm' } as any,
          toLocationId: { province: 'hn' } as any,
          stops: [],
        },
        seats: [{ seatNumber: 'A1', status: SeatStatus.AVAILABLE }],
      });

      // Mock Repository call
      tripsRepository.findPublicTrips.mockResolvedValue([mockTrip]);

      mockReviewModel.aggregate.mockResolvedValue([
        { _id: mockCompanyId, avgRating: 4.5, reviewCount: 10 },
      ]);

      const result = await service.findPublicTrips(query);

      expect(tripsRepository.findPublicTrips).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('companyAvgRating', 4.5);
    });
  });

  // ================= TEST UPDATE =================
  describe('update', () => {
    const updateDto: UpdateTripDto = { price: 250000 };

    it('should update trip successfully if no bookings', async () => {
      const existingTrip = mockTripDoc();
      tripsRepository.findByIdWithDetails.mockResolvedValue(existingTrip);
      tripsRepository.save.mockResolvedValue(existingTrip);

      const result = await service.update(mockTripId.toString(), updateDto);

      expect(tripsRepository.save).toHaveBeenCalledWith(existingTrip);
      expect(result.price).toBe(250000);
    });

    it('should throw Conflict if changing core info with active bookings', async () => {
      const existingTrip = mockTripDoc({
        seats: [{ seatNumber: 'A1', status: SeatStatus.BOOKED }],
      });
      tripsRepository.findByIdWithDetails.mockResolvedValue(existingTrip);

      await expect(
        service.update(mockTripId.toString(), updateDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ================= TEST CANCEL (Transaction) =================
  describe('cancel', () => {
    it('should cancel trip and associated bookings', async () => {
      const activeTrip = mockTripDoc({ status: TripStatus.SCHEDULED });
      // Mock findById with session
      tripsRepository.findById.mockResolvedValue(activeTrip);

      // Mock bookings query (vẫn dùng Model trực tiếp)
      const mockBooking = {
        _id: mockBookingId,
        status: BookingStatus.CONFIRMED,
        save: jest.fn(),
        toObject: jest
          .fn()
          .mockReturnValue({
            _id: mockBookingId,
            status: BookingStatus.CANCELLED,
          }),
      };
      mockBookingModel.find.mockReturnValue({
        session: jest.fn().mockResolvedValue([mockBooking]),
      });

      await service.cancel(mockTripId.toString());

      expect(mockConnection.startSession).toHaveBeenCalled();
      expect(mockSession.startTransaction).toHaveBeenCalled();

      expect(activeTrip.status).toBe(TripStatus.CANCELLED);
      expect(mockBooking.status).toBe(BookingStatus.CANCELLED);
      expect(mockBooking.save).toHaveBeenCalled();

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.cancelled',
        expect.any(Object),
      );

      // Kiểm tra repo.save được gọi với session
      expect(tripsRepository.save).toHaveBeenCalledWith(
        activeTrip,
        mockSession,
      );
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequest if trip already finished', async () => {
      const arrivedTrip = mockTripDoc({ status: TripStatus.ARRIVED });
      tripsRepository.findById.mockResolvedValue(arrivedTrip);

      await expect(service.cancel(mockTripId.toString())).rejects.toThrow(
        BadRequestException,
      );
      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
  });

  // ================= TEST UPDATE STOP STATUS =================
  describe('updateTripStopStatus', () => {
    it('should update status of a stop', async () => {
      const stopId = new Types.ObjectId();
      const trip = mockTripDoc({
        route: {
          stops: [
            {
              locationId: { _id: stopId } as any,
              status: TripStopStatus.PENDING,
              expectedArrivalTime: new Date(),
            },
          ],
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
        },
      });
      tripsRepository.findByIdWithDetails.mockResolvedValue(trip);
      tripsRepository.save.mockResolvedValue(trip);

      await service.updateTripStopStatus(
        mockTripId.toString(),
        stopId.toString(),
        TripStopStatus.ARRIVED,
      );

      expect(trip.route.stops[0].status).toBe(TripStopStatus.ARRIVED);
      expect(tripsRepository.save).toHaveBeenCalledWith(trip);
    });
  });

  // ================= TEST UPDATE SEAT STATUSES =================
  describe('updateSeatStatuses', () => {
    it('should update seat statuses correctly', async () => {
      const trip = mockTripDoc({
        seats: [
          { seatNumber: 'A01', status: SeatStatus.AVAILABLE },
          { seatNumber: 'A02', status: SeatStatus.AVAILABLE },
        ],
      });
      tripsRepository.findById.mockResolvedValue(trip);
      tripsRepository.save.mockResolvedValue(trip);

      await service.updateSeatStatuses(
        mockTripId,
        ['A01'],
        SeatStatus.HELD,
        mockBookingId,
      );

      expect(trip.seats.find((s) => s.seatNumber === 'A01')?.status).toBe(
        SeatStatus.HELD,
      );
      expect(tripsRepository.save).toHaveBeenCalledWith(trip);
    });

    it('should throw Conflict if holding an already held seat', async () => {
      const trip = mockTripDoc({
        seats: [{ seatNumber: 'A01', status: SeatStatus.BOOKED }],
      });
      tripsRepository.findById.mockResolvedValue(trip);

      await expect(
        service.updateSeatStatuses(mockTripId, ['A01'], SeatStatus.HELD),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ================= TEST FIND POPULAR ROUTES =================
  describe('findPopularRoutes', () => {
    it('should return aggregated popular routes', async () => {
      const mockAggResult = [
        { fromLocation: {}, toLocation: {}, bookingCount: 10 },
      ];
      mockBookingModel.aggregate.mockResolvedValue(mockAggResult);

      const result = await service.findPopularRoutes();
      expect(result).toEqual(mockAggResult);
      expect(mockBookingModel.aggregate).toHaveBeenCalled();
    });
  });
});
