import { faker } from '@faker-js/faker/locale/vi';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  public async seedAll() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (nodeEnv === 'production') {
      this.logger.error(
        '❌ DANGER: Không được phép chạy Seed/Clear dữ liệu trên môi trường Production!',
      );
      return;
    }
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
    const drivers = users.filter((u) => u.roles.includes(UserRole.DRIVER));
    this.logger.log(
      `- Đã lọc được ${drivers.length} tài xế sẵn sàng nhận chuyến.`,
    );

    const vehicles = await this.seedVehicles(companies);

    const trips = await this.seedTrips(vehicles, locations, drivers);

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
    this.logger.log(`>>> Bước 4: Seeding Users, Admins và Drivers...`);
    const createdUsers: UserDocument[] = [];

    for (let i = 0; i < userCount; i++) {
      const userData: Partial<User> = {
        name: faker.person.fullName() || `Người dùng ${i}`,
        email: faker.internet.email({ provider: `test${i}.com` }).toLowerCase(),
        phone: `08${faker.string.numeric(8)}`,
        passwordHash: 'password123',
        isEmailVerified: true,
        roles: [UserRole.USER],
        lastLoginDate: new Date(),
      };

      if (i < adminCount && i < companies.length) {
        if (userData.roles) {
          userData.roles.push(UserRole.COMPANY_ADMIN);
        }
        userData.companyId = companies[i]._id;
      }

      const newUser = await this.userModel.create(userData);
      createdUsers.push(newUser);
    }

    // --- [NEW] Tạo Drivers ---
    // Tạo khoảng 10 tài xế, chia đều cho các nhà xe (theo chỉ mục)
    const driverCount = 10;
    this.logger.log(
      `--- Đang tạo thêm ${driverCount} tài khoản Driver (pass: driver123)...`,
    );

    for (let i = 0; i < driverCount; i++) {
      // Chia driver cho các company
      const companyIndex = i % companies.length;
      const targetCompany = companies[companyIndex];

      const driverData: Partial<User> = {
        name: `Tài xế ${faker.person.lastName()} ${faker.person.firstName()}`,
        email: `driver${i}@${targetCompany.code.toLowerCase()}.com`,
        phone: `07${faker.string.numeric(8)}`, // Đầu số riêng cho dễ phân biệt
        passwordHash: 'driver123', // Mật khẩu cố định theo yêu cầu
        isEmailVerified: true,
        roles: [UserRole.DRIVER],
        companyId: targetCompany._id,
        lastLoginDate: new Date(),
      };

      const newDriver = await this.userModel.create(driverData);
      createdUsers.push(newDriver);
    }

    this.logger.log(
      `- Tổng cộng đã tạo ${createdUsers.length} account (Users + Admins + Drivers).`,
    );
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
    drivers: UserDocument[], // [NEW] Nhận danh sách drivers
  ): Promise<TripDocument[]> {
    this.logger.log(`>>> Bước 6: Seeding Trips (Có gán Tài xế)...`);
    const createdTrips: TripDocument[] = [];

    const validEndpoints = locations.filter((l) => l.type !== 'rest_stop');
    if (validEndpoints.length < 2) {
      this.logger.error(
        "Dừng seeding: Cần ít nhất 2 địa điểm không phải 'rest_stop'.",
      );
      return [];
    }

    const halfwayIndex = Math.floor(vehicles.length / 2);
    const pastTripVehicles = vehicles.slice(0, halfwayIndex);
    const todayTripVehicles = vehicles.slice(halfwayIndex);

    // --- Helper function để chọn tài xế cùng công ty ---
    const assignRandomDriver = (companyId: any) => {
      // Lọc các driver thuộc công ty này
      const companyDrivers = drivers.filter(
        (d) => d.companyId && d.companyId.toString() === companyId.toString(),
      );

      // Random: Khoảng 70% trip sẽ được gán driver nếu có driver
      if (companyDrivers.length > 0 && Math.random() < 0.7) {
        const selected = faker.helpers.arrayElement(companyDrivers);
        return selected._id;
      }
      return undefined;
    };

    // --- TẠO CHUYẾN ĐI QUÁ KHỨ ---
    for (const vehicle of pastTripVehicles) {
      const [fromLocation, toLocation] = faker.helpers
        .shuffle(validEndpoints)
        .slice(0, 2);
      const seats: Seat[] = (this.tripsService as any).generateSeatsFromVehicle(
        vehicle,
      );

      const departureTime = dayjs()
        .subtract(1, 'day')
        .hour(faker.number.int({ min: 5, max: 22 }))
        .minute(0)
        .second(0)
        .toDate();
      const arrivalTime = dayjs(departureTime)
        .add(faker.number.int({ min: 4, max: 8 }), 'hour')
        .toDate();

      const tripData: Partial<Trip> = {
        companyId: vehicle.companyId,
        vehicleId: vehicle._id,
        // [NEW] Gán tài xế
        driverId: assignRandomDriver(vehicle.companyId),
        departureTime,
        expectedArrivalTime: arrivalTime,
        price: faker.number.int({ min: 15, max: 50 }) * 10000,
        seats,
        status: TripStatus.ARRIVED,
      };

      const tripGo = await this.tripModel.create({
        ...tripData,
        route: {
          fromLocationId: fromLocation._id,
          toLocationId: toLocation._id,
          stops: [],
        },
      });
      // Tạo chuyến về (nhưng code cũ của bạn không loop thêm vehicle nên ta push thẳng)
      createdTrips.push(tripGo);

      // Tạo thêm chiều về nếu muốn
      const tripReturn = await this.tripModel.create({
        ...tripData,
        driverId: assignRandomDriver(vehicle.companyId), // Random lại cho chuyến về
        departureTime: dayjs(departureTime).add(12, 'hour').toDate(),
        expectedArrivalTime: dayjs(arrivalTime).add(12, 'hour').toDate(),
        route: {
          fromLocationId: toLocation._id,
          toLocationId: fromLocation._id,
          stops: [],
        },
      });
      createdTrips.push(tripReturn);
    }

    // --- TẠO CHUYẾN ĐI HÔM NAY ---
    for (const vehicle of todayTripVehicles) {
      const [fromLocation, toLocation] = faker.helpers
        .shuffle(validEndpoints)
        .slice(0, 2);
      const seats: Seat[] = (this.tripsService as any).generateSeatsFromVehicle(
        vehicle,
      );

      const departureTime = dayjs()
        .hour(faker.number.int({ min: 1, max: 23 }))
        .minute(0)
        .second(0)
        .toDate();
      const arrivalTime = dayjs(departureTime)
        .add(faker.number.int({ min: 4, max: 8 }), 'hour')
        .toDate();

      const tripData: Partial<Trip> = {
        companyId: vehicle.companyId,
        vehicleId: vehicle._id,
        // [NEW] Gán tài xế
        driverId: assignRandomDriver(vehicle.companyId),
        departureTime,
        expectedArrivalTime: arrivalTime,
        price: faker.number.int({ min: 15, max: 50 }) * 10000,
        seats,
        status: TripStatus.SCHEDULED,
      };

      const tripGo = await this.tripModel.create({
        ...tripData,
        route: {
          fromLocationId: fromLocation._id,
          toLocationId: toLocation._id,
          stops: [],
        },
      });
      createdTrips.push(tripGo);

      // Tạo chiều về
      const tripReturn = await this.tripModel.create({
        ...tripData,
        driverId: assignRandomDriver(vehicle.companyId),
        departureTime: dayjs(departureTime).add(10, 'hour').toDate(),
        expectedArrivalTime: dayjs(arrivalTime).add(10, 'hour').toDate(),
        route: {
          fromLocationId: toLocation._id,
          toLocationId: fromLocation._id,
          stops: [],
        },
      });
      createdTrips.push(tripReturn);
    }

    this.logger.log(
      `- Tổng cộng đã tạo ${createdTrips.length} chuyến đi (cả khứ hồi).`,
    );
    return createdTrips;
  }

  private async seedBookingsAndReviews(
    trips: TripDocument[],
    users: UserDocument[],
  ) {
    this.logger.log('>>> Bước 7: Seeding Bookings và Reviews...');

    // Chỉ user thường mới booking (loại trừ Admin và Driver) để dữ liệu sạch
    const passengerUsers = users.filter(
      (u) =>
        u.roles.includes(UserRole.USER) &&
        !u.roles.includes(UserRole.COMPANY_ADMIN) &&
        !u.roles.includes(UserRole.DRIVER),
    );

    const pastTrips = trips.filter(
      (trip) => trip.status === TripStatus.ARRIVED,
    );
    let bookingCount = 0;
    let reviewCount = 0;

    for (let i = 0; i < pastTrips.length; i++) {
      const trip = pastTrips[i];
      const user = faker.helpers.arrayElement(passengerUsers); // Lấy user thường
      const seatToBook = trip.seats.find(
        (s) => s.status === SeatStatus.AVAILABLE,
      );

      if (seatToBook && user) {
        // [NEW] Logic Check-in: Khoảng 30% vé đã check-in
        const isCheckedIn = Math.random() < 0.3;

        const bookingData: Partial<Booking> = {
          userId: user._id,
          tripId: trip._id,
          companyId: trip.companyId,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          totalAmount: trip.price,
          // Field Check-in
          isCheckedIn: isCheckedIn,
          checkedInAt: isCheckedIn ? faker.date.recent() : undefined,

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

        // Logic Review cũ
        if (i < pastTrips.length / 2) {
          const reviewData: Partial<Review> = {
            userId: user._id,
            displayName: user.name,
            tripId: trip._id,
            companyId: trip.companyId,
            bookingId: createdBooking._id,
            rating: faker.number.int({ min: 3, max: 5 }),
            comment: faker.lorem.sentence(),
          };
          await this.reviewModel.create(reviewData);
          reviewCount++;
        }
      }
    }
    this.logger.log(
      `- Đã tạo ${bookingCount} lượt đặt vé cho các chuyến đã hoàn thành.`,
    );
    this.logger.log(`- Đã tạo ${reviewCount} đánh giá (một nửa số booking).`);
  }
}
