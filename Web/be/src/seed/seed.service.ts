import { faker } from '@faker-js/faker/locale/vi';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as fs from 'fs/promises';
import { Model } from 'mongoose';
import * as path from 'path';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from 'src/bookings/schemas/booking.schema';
import {
  Company,
  CompanyDocument,
  CompanyStatus,
} from 'src/companies/schemas/company.schema';
import {
  Location,
  LocationDocument,
} from 'src/locations/schemas/location.schema';
import { Review, ReviewDocument } from 'src/reviews/schemas/review.schema';
import {
  Seat,
  SeatStatus,
  Trip,
  TripDocument,
  TripStatus,
} from 'src/trips/schemas/trip.schema';
import { TripsService } from 'src/trips/trips.service';
import { User, UserDocument, UserRole } from 'src/users/schemas/user.schema';
import {
  Vehicle,
  VehicleDocument,
  VehicleStatus,
} from 'src/vehicles/schemas/vehicle.schema';
import { VehiclesService } from 'src/vehicles/vehicles.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly vehiclesService: VehiclesService,
    private readonly tripsService: TripsService,
  ) {}

  public async seedAll() {
    this.logger.log('Bắt đầu quá trình seeding dữ liệu một cách cẩn thận...');

    await this.clearDatabase();

    const locations = await this.seedLocations();
    if (locations.filter((l) => l.type === 'bus_station').length < 2) {
      this.logger.error(
        "Dừng seeding: Cần ít nhất 2 địa điểm 'bus_station' trong file JSON.",
      );
      return;
    }

    const companies = await this.seedCompanies(50);
    const users = await this.seedUsers(companies, 100, 50);
    const vehicles = await this.seedVehicles(companies);
    const trips = await this.seedTrips(vehicles, locations);
    await this.seedBookingsAndReviews(trips, users);

    this.logger.log('Hoàn tất quá trình seeding!');
  }

  private async clearDatabase() {
    this.logger.log('>>> Bước 1: Xóa dữ liệu cũ...');
    await this.reviewModel.deleteMany({});
    await this.bookingModel.deleteMany({});
    await this.tripModel.deleteMany({});
    await this.vehicleModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.companyModel.deleteMany({});
    await this.locationModel.deleteMany({});
    this.logger.log('- Đã xóa dữ liệu từ 7 collections.');
  }

  private async seedLocations(): Promise<LocationDocument[]> {
    this.logger.log('>>> Bước 2: Seeding Locations (tuần tự)...');
    const filePath = path.join(
      __dirname,
      '..',
      'data',
      'vietnam-locations.json',
    );
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const locationsToCreate: Partial<Location>[] = JSON.parse(data);
      if (!locationsToCreate || locationsToCreate.length === 0) {
        this.logger.warn('- File locations.json rỗng hoặc không có dữ liệu.');
        return [];
      }

      const createdLocations: LocationDocument[] = [];
      for (const locData of locationsToCreate) {
        const newLocation = await this.locationModel.create(locData);
        createdLocations.push(newLocation);
      }

      this.logger.log(`- Đã tạo ${createdLocations.length} địa điểm.`);
      return createdLocations;
    } catch (error) {
      this.logger.error('Lỗi khi seeding locations.json. Lỗi gốc:', error);
      throw error;
    }
  }

  private async seedCompanies(count: number): Promise<CompanyDocument[]> {
    this.logger.log(`>>> Bước 3: Seeding ${count} Companies...`);
    const createdCompanies: CompanyDocument[] = [];
    const companyNames = [
      'Phương Trang',
      'Thành Bưởi',
      'Kumho Samco',
      'FUTA Bus Lines',
      'Hải Vân Express',
    ];

    // SỬA LỖI: Sử dụng Set để đảm bảo tên không bao giờ trùng lặp
    const uniqueNames = new Set<string>();
    companyNames.forEach((name) => uniqueNames.add(name));

    while (uniqueNames.size < count) {
      uniqueNames.add(`Nhà xe ${faker.company.name()}`);
    }

    const namesAsArray = Array.from(uniqueNames);

    for (let i = 0; i < count; i++) {
      const name = namesAsArray[i];
      const companyData: Partial<Company> = {
        name,
        // Đảm bảo code cũng duy nhất bằng cách thêm index
        code: name.replace(/\s+/g, '').toUpperCase().substring(0, 10) + `_${i}`,
        email: faker.internet.email({ provider: 'example.com' }).toLowerCase(),
        phone: `09${faker.string.numeric(8)}`,
        address: faker.location.streetAddress({ useFullAddress: true }),
        status: CompanyStatus.ACTIVE,
      };
      const newCompany = await this.companyModel.create(companyData);
      createdCompanies.push(newCompany);
    }

    this.logger.log(`- Đã tạo ${createdCompanies.length} nhà xe.`);
    return createdCompanies;
  }

  private async seedUsers(
    companies: CompanyDocument[],
    userCount: number,
    adminCount: number,
  ): Promise<UserDocument[]> {
    this.logger.log(`>>> Bước 4: Seeding ${userCount} Users...`);
    const createdUsers: UserDocument[] = [];
    for (let i = 0; i < userCount; i++) {
      const userData: Partial<User> = {
        name: faker.person.fullName() || `Người dùng ${i}`,
        email: faker.internet.email({ provider: `test${i}.com` }).toLowerCase(),
        phone: `08${faker.string.numeric(8)}`,
        passwordHash: 'password123',
        isEmailVerified: true,
        roles: [UserRole.USER],
      };
      if (i < adminCount && i < companies.length) {
        userData.roles!.push(UserRole.COMPANY_ADMIN);
        userData.companyId = companies[i]._id;
      }
      const newUser = await this.userModel.create(userData);
      createdUsers.push(newUser);
    }
    this.logger.log(`- Đã tạo ${createdUsers.length} người dùng.`);
    return createdUsers;
  }

  private createSeatLayout(config: {
    floors: number;
    seatRows: number;
    seatColumns: number;
    aislePositions: number[];
  }) {
    const floor1Result = (this.vehiclesService as any).generateSeatMapLayout(
      config.seatRows,
      config.seatColumns,
      config.aislePositions,
      'A',
    );
    let totalSeats = floor1Result.seatCount;
    let seatMapFloor2;
    if (config.floors > 1) {
      const floor2Result = (this.vehiclesService as any).generateSeatMapLayout(
        config.seatRows,
        config.seatColumns,
        config.aislePositions,
        'B',
      );
      totalSeats += floor2Result.seatCount;
      seatMapFloor2 = floor2Result.seatMap;
    }
    return { totalSeats, seatMap: floor1Result.seatMap, seatMapFloor2 };
  }

  private async seedVehicles(
    companies: CompanyDocument[],
  ): Promise<VehicleDocument[]> {
    this.logger.log(`>>> Bước 5: Seeding Vehicles (2 cho mỗi nhà xe)...`);
    const createdVehicles: VehicleDocument[] = [];
    for (const company of companies) {
      for (let i = 0; i < 2; i++) {
        const vehicleConfig = {
          type: i === 0 ? 'Xe giường nằm 40 chỗ' : 'Limousine 9 chỗ',
          floors: i === 0 ? 2 : 1,
          seatColumns: i === 0 ? 3 : 3,
          seatRows: i === 0 ? 7 : 3,
          aislePositions: i === 0 ? [2] : [2],
        };
        const { totalSeats, seatMap, seatMapFloor2 } =
          this.createSeatLayout(vehicleConfig);

        const vehicleData: Partial<Vehicle> = {
          companyId: company._id,
          vehicleNumber: `51A-${faker.string.numeric(5)}`,
          status: VehicleStatus.ACTIVE,
          ...vehicleConfig,
          totalSeats,
          seatMap,
          seatMapFloor2,
        };
        const newVehicle = await this.vehicleModel.create(vehicleData);
        createdVehicles.push(newVehicle);
      }
    }
    this.logger.log(`- Đã tạo ${createdVehicles.length} xe.`);
    return createdVehicles;
  }

  private async seedTrips(
    vehicles: VehicleDocument[],
    locations: LocationDocument[],
  ): Promise<TripDocument[]> {
    this.logger.log(`>>> Bước 6: Seeding Trips (1 đi, 1 về cho mỗi xe)...`);
    const createdTrips: TripDocument[] = [];
    const busStations = locations.filter((l) => l.type === 'bus_station');

    for (const vehicle of vehicles) {
      const [fromLocation, toLocation] = faker.helpers
        .shuffle(busStations)
        .slice(0, 2);
      const seats: Seat[] = (this.tripsService as any).generateSeatsFromVehicle(
        vehicle,
      );

      const departureTime = dayjs()
        .add(faker.number.int({ min: 1, max: 3 }), 'day')
        .hour(faker.number.int({ min: 5, max: 22 }))
        .minute(0)
        .second(0)
        .toDate();
      const expectedArrivalTime = dayjs(departureTime)
        .add(faker.number.int({ min: 4, max: 8 }), 'hour')
        .toDate();

      const baseTripData = {
        companyId: vehicle.companyId,
        vehicleId: vehicle._id,
        departureTime,
        expectedArrivalTime,
        price: faker.number.int({ min: 15, max: 50 }) * 10000,
        status: TripStatus.SCHEDULED,
        seats,
      };

      const tripGo = await this.tripModel.create({
        ...baseTripData,
        route: {
          fromLocationId: fromLocation._id,
          toLocationId: toLocation._id,
          stops: [],
        },
      });
      const tripReturn = await this.tripModel.create({
        ...baseTripData,
        route: {
          fromLocationId: toLocation._id,
          toLocationId: fromLocation._id,
          stops: [],
        },
      });

      createdTrips.push(tripGo, tripReturn);
    }
    this.logger.log(`- Đã tạo ${createdTrips.length} chuyến đi.`);
    return createdTrips;
  }

  private async seedBookingsAndReviews(
    trips: TripDocument[],
    users: UserDocument[],
  ) {
    this.logger.log('>>> Bước 7: Seeding Bookings và Reviews (tuần tự)...');
    let bookingCount = 0;
    let reviewCount = 0;

    for (const trip of trips) {
      const user = faker.helpers.arrayElement(
        users.filter((u) => u.roles.includes(UserRole.USER)),
      );
      const seatToBook = trip.seats.find(
        (s) => s.status === SeatStatus.AVAILABLE,
      );

      if (seatToBook && user) {
        const bookingData: Partial<Booking> = {
          userId: user._id,
          tripId: trip._id,
          companyId: trip.companyId,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          totalAmount: trip.price,
          passengers: [
            {
              name: user.name,
              phone: user.phone,
              seatNumber: seatToBook.seatNumber,
              price: trip.price,
            },
          ],
          contactName: user.name,
          contactPhone: user.phone,
          ticketCode: faker.string.alphanumeric(8).toUpperCase(),
        };
        const createdBooking = await this.bookingModel.create(bookingData);
        bookingCount++;

        const reviewData: Partial<Review> = {
          userId: user._id,
          displayName: user.name,
          tripId: trip._id,
          companyId: trip.companyId,
          bookingId: createdBooking._id,
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: faker.lorem.sentence(),
        };
        await this.reviewModel.create(reviewData);
        reviewCount++;
      }
    }
    this.logger.log(`- Đã tạo ${bookingCount} lượt đặt vé.`);
    this.logger.log(`- Đã tạo ${reviewCount} đánh giá.`);
  }
}
