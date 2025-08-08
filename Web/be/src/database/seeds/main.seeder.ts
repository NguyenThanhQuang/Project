/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CompaniesService } from '../../companies/companies.service';
import { CompanyDocument } from '../../companies/schemas/company.schema';
import { LocationsService } from '../../locations/locations.service';
import {
  LocationDocument,
  LocationType,
} from '../../locations/schemas/location.schema';
import { TripsService } from '../../trips/trips.service';
import { VehicleDocument } from '../../vehicles/schemas/vehicle.schema';
import { VehiclesService } from '../../vehicles/vehicles.service';

@Injectable()
export class MainSeeder {
  private readonly logger = new Logger(MainSeeder.name);

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly vehiclesService: VehiclesService,
    private readonly locationsService: LocationsService,
    private readonly tripsService: TripsService,
  ) {}

  async run() {
    this.logger.log('Bắt đầu quá trình seeding...');

    // Xóa dữ liệu cũ để tránh trùng lặp
    await this._cleanDatabase();

    // Bắt đầu tạo dữ liệu mới
    const companies = await this._seedCompanies();
    const vehicles = await this._seedVehicles(companies);
    const locations = await this._seedLocations();
    await this._seedTrips(companies, vehicles, locations);

    this.logger.log('Seeding hoàn tất!');
  }

  private async _cleanDatabase() {
    this.logger.log('Đang xóa dữ liệu cũ...');
    await this.tripsService.deleteAll();
    // await this.vehiclesService.deleteAll();
    await this.companiesService.deleteAll();
    // await this.locationsService.deleteAll();
    this.logger.log('Xóa dữ liệu cũ thành công.');
  }

  private async _seedCompanies(): Promise<CompanyDocument[]> {
    this.logger.log('Đang tạo các nhà xe...');
    const companiesData = [
      {
        name: 'Phương Trang',
        code: 'PHUONGTRANG',
        address: 'TP. Hồ Chí Minh',
        phone: '19006067',
        email: 'hotro@futabus.vn',
      },
      {
        name: 'Thành Bưởi',
        code: 'THANHBUOI',
        address: 'TP. Hồ Chí Minh',
        phone: '19006079',
        email: 'hotro@thanhbuoi.com.vn',
      },
      {
        name: 'Hoàng Long',
        code: 'HOANGLONG',
        address: 'Hải Phòng',
        phone: '19006786',
        email: 'hotro@hoanglongasia.com',
      },
    ];

    const companies = await Promise.all(
      companiesData.map((c) => this.companiesService.create(c)),
    );
    this.logger.log(`Đã tạo ${companies.length} nhà xe.`);
    return companies;
  }

  private async _seedVehicles(
    companies: CompanyDocument[],
  ): Promise<VehicleDocument[]> {
    this.logger.log('Đang tạo các loại xe...');
    const vehiclesData = [
      { type: 'Giường nằm 40 chỗ', totalSeats: 40, floors: 2 },
      { type: 'Ghế ngồi 29 chỗ', totalSeats: 29, floors: 1 },
    ];
    const createdVehicles: VehicleDocument[] = [];

    for (const company of companies) {
      for (const vehicle of vehiclesData) {
        const newVehicle = await this.vehiclesService.create({
          companyId: company._id,
          ...vehicle,
        });
        createdVehicles.push(newVehicle);
      }
    }
    this.logger.log(`Đã tạo ${createdVehicles.length} loại xe.`);
    return createdVehicles;
  }

  private async _seedLocations(): Promise<LocationDocument[]> {
    this.logger.log('Đang tạo các địa điểm...');
    const locationsData = [
      {
        name: 'Bến xe Miền Đông',
        province: 'Hồ Chí Minh',
        fullAddress: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh',
        location: { type: 'Point', coordinates: [106.7059, 10.8191] },
        type: LocationType.BUS_STATION,
      },
      {
        name: 'Bến xe Miền Tây',
        province: 'Hồ Chí Minh',
        fullAddress: '395 Kinh Dương Vương, An Lạc, Bình Tân',
        location: { type: 'Point', coordinates: [106.6114, 10.7384] },
        type: LocationType.BUS_STATION,
      },
      {
        name: 'VP Phương Trang Quận 1',
        province: 'Hồ Chí Minh',
        fullAddress: '202-204 Đề Thám, Quận 1',
        location: { type: 'Point', coordinates: [106.6917, 10.7651] },
        type: LocationType.COMPANY_OFFICE,
      },
      {
        name: 'Bến xe Đà Lạt',
        province: 'Lâm Đồng',
        fullAddress: '01 Tô Hiến Thành, Phường 3, TP. Đà Lạt',
        location: { type: 'Point', coordinates: [108.4419, 11.9287] },
        type: LocationType.BUS_STATION,
      },
      {
        name: 'Bến xe Giáp Bát',
        province: 'Hà Nội',
        fullAddress: 'Km6 đường Giải Phóng, Hoàng Mai',
        location: { type: 'Point', coordinates: [105.8413, 20.9823] },
        type: LocationType.BUS_STATION,
      },
      {
        name: 'Bến xe Mỹ Đình',
        province: 'Hà Nội',
        fullAddress: '20 Phạm Hùng, Mỹ Đình 2, Nam Từ Liêm',
        location: { type: 'Point', coordinates: [105.7788, 21.0284] },
        type: LocationType.BUS_STATION,
      },
      {
        name: 'Bến xe Trung tâm Đà Nẵng',
        province: 'Đà Nẵng',
        fullAddress: '201 Tôn Đức Thắng, Hoà Minh, Liên Chiểu',
        location: { type: 'Point', coordinates: [108.1714, 16.0717] },
        type: LocationType.BUS_STATION,
      },
      {
        name: 'TP. Nha Trang',
        province: 'Khánh Hòa',
        fullAddress: 'Thành phố Nha Trang, Khánh Hòa',
        location: { type: 'Point', coordinates: [109.1925, 12.2458] },
        type: LocationType.CITY,
      },
      {
        name: 'TP. Vũng Tàu',
        province: 'Bà Rịa - Vũng Tàu',
        fullAddress: 'Thành phố Vũng Tàu',
        location: { type: 'Point', coordinates: [107.0855, 10.3475] },
        type: LocationType.CITY,
      },
    ];

    const locations = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      locationsData.map((l) => this.locationsService.create(l as any)),
    );
    this.logger.log(`Đã tạo ${locations.length} địa điểm.`);
    return locations;
  }

  private _getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  private async _seedTrips(
    companies: CompanyDocument[],
    vehicles: VehicleDocument[],
    locations: LocationDocument[],
  ) {
    this.logger.log('Đang tạo các chuyến đi...');
    const totalTrips = 50;
    const hcmLocations = locations.filter((l) => l.province === 'Hồ Chí Minh');

    for (let i = 0; i < totalTrips; i++) {
      const company = this._getRandomItem(companies);
      const companyVehicles = vehicles.filter(
        (v) => v.companyId.toString() === company._id.toString(),
      );
      const vehicle = this._getRandomItem(companyVehicles);

      const fromLocation = this._getRandomItem(locations);
      let toLocation = this._getRandomItem(locations);
      // Đảm bảo điểm đi và điểm đến khác nhau
      while (fromLocation._id === toLocation._id) {
        toLocation = this._getRandomItem(locations);
      }

      // Tạo thời gian ngẫu nhiên trong 7 ngày tới
      const departureFromNow = Math.floor(Math.random() * 7 * 24); // giờ trong 7 ngày
      const durationHours = 4 + Math.floor(Math.random() * 8); // 4-12 tiếng
      const departureTime = dayjs()
        .add(departureFromNow, 'hour')
        .minute(0)
        .second(0);
      const expectedArrivalTime = departureTime.add(durationHours, 'hour');

      const price = (Math.floor(Math.random() * 30) + 15) * 10000; // 150k - 450k

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.tripsService.create({
        companyId: company._id,
        vehicleId: vehicle._id,
        route: {
          fromLocationId: fromLocation._id.toString(),
          toLocationId: toLocation._id.toString(),
        },
        departureTime: departureTime.toISOString(),
        expectedArrivalTime: expectedArrivalTime.toISOString(),
        price,
        status: 'scheduled',
      } as any);
    }
    this.logger.log(`Đã tạo ${totalTrips} chuyến đi ngẫu nhiên.`);
  }
}
