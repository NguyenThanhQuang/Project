import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Model, Types } from 'mongoose';
import {
  CompanyDocument,
  CompanyStatus,
} from '../companies/schemas/company.schema';
import {
  VehicleDocument,
  VehicleStatus,
} from '../vehicles/schemas/vehicle.schema';
import { Trip, TripDocument, TripStatus } from './schemas/trip.schema';
import { TripsService } from './trips.service';

@Injectable()
export class TripSchedulerService {
  private readonly logger = new Logger(TripSchedulerService.name);

  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    private readonly tripsService: TripsService,
  ) {}

  /**
   * Tự động tạo các chuyến đi cho ngày hôm sau.
   * Chỉ chạy từ các "Mẫu lặp lại" (`isRecurrenceTemplate`) được kích hoạt (`isRecurrenceActive`).
   * Kiểm tra trạng thái của Nhà xe và Xe trước khi tạo.
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'createDailyTrips' })
  async handleCreateDailyTrips() {
    this.logger.log(
      '>>> [CRON] Bắt đầu tác vụ tự động tạo chuyến đi hàng ngày...',
    );

    const templates = await this.tripModel
      .find({ isRecurrenceTemplate: true, isRecurrenceActive: true })
      .populate<{ vehicleId: VehicleDocument }>('vehicleId', 'status')
      .populate<{ companyId: CompanyDocument }>('companyId', 'status')
      .lean()
      .exec();

    if (templates.length === 0) {
      this.logger.log(
        'Không tìm thấy chuyến đi mẫu nào được kích hoạt. Kết thúc tác vụ.',
      );
      return;
    }

    this.logger.log(
      `Tìm thấy ${templates.length} chuyến đi mẫu để tạo bản sao.`,
    );

    let createdCount = 0;
    const tomorrow = dayjs().add(1, 'day');

    for (const template of templates) {
      const vehicle = template.vehicleId as VehicleDocument;
      const company = template.companyId as CompanyDocument;

      if (vehicle?.status !== VehicleStatus.ACTIVE) {
        this.logger.warn(
          `Bỏ qua mẫu ${template._id.toString()} vì xe ${vehicle._id.toString()} không ở trạng thái "Hoạt động".`,
        );
        continue;
      }
      if (company?.status !== CompanyStatus.ACTIVE) {
        this.logger.warn(
          `Bỏ qua mẫu ${template._id.toString()} vì nhà xe ${company._id.toString()} không ở trạng thái "Hoạt động".`,
        );
        continue;
      }

      const templateDeparture = dayjs(template.departureTime);
      const newDepartureTime = tomorrow
        .hour(templateDeparture.hour())
        .minute(templateDeparture.minute())
        .second(0)
        .millisecond(0)
        .toDate();

      const existingTrip = await this.tripModel.findOne({
        recurrenceParentId: template._id,
        departureTime: newDepartureTime,
      });

      if (existingTrip) {
        this.logger.warn(
          `Chuyến đi cho mẫu ${template._id.toString()} vào ngày mai đã tồn tại. Bỏ qua.`,
        );
        continue;
      }

      const vehicleDocForSeatGen = await this.tripsService[
        'vehiclesService'
      ].findOne(vehicle._id);
      const newSeats = (this.tripsService as any).generateSeatsFromVehicle(
        vehicleDocForSeatGen,
      );

      const tripDuration = dayjs(template.expectedArrivalTime).diff(
        template.departureTime,
      );

      const newTripData: Partial<Trip> = {
        companyId: new Types.ObjectId(template.companyId._id),
        vehicleId: new Types.ObjectId(template.vehicleId._id),
        route: {
          ...template.route,
          fromLocationId: new Types.ObjectId(template.route.fromLocationId),
          toLocationId: new Types.ObjectId(template.route.toLocationId),
        },
        price: template.price,
        isRecurrenceTemplate: false,
        isRecurrenceActive: false,
        recurrenceParentId: new Types.ObjectId(template._id),
        departureTime: newDepartureTime,
        expectedArrivalTime: dayjs(newDepartureTime).add(tripDuration).toDate(),
        status: TripStatus.SCHEDULED,
        seats: newSeats,
      };

      await this.tripModel.create(newTripData);
      createdCount++;
    }

    this.logger.log(
      `<<< Hoàn tất: Đã tạo thành công ${createdCount} chuyến đi mới.`,
    );
  }

  /**
   * Tự động cập nhật các chuyến đã khởi hành (SCHEDULED -> DEPARTED).
   * Chạy mỗi 15 phút để đảm bảo trạng thái gần với thời gian thực.
   */
  @Cron(CronExpression.EVERY_10_MINUTES, { name: 'updateDepartedTrips' })
  async handleUpdateDepartedTrips() {
    this.logger.log('>>> [CRON] Bắt đầu quét các chuyến đi đã khởi hành...');
    const now = new Date();

    const result = await this.tripModel.updateMany(
      {
        status: TripStatus.SCHEDULED,
        departureTime: { $lte: now },
      },
      {
        $set: { status: TripStatus.DEPARTED },
      },
    );

    if (result.modifiedCount > 0) {
      this.logger.log(
        `<<< [CRON] Đã cập nhật ${result.modifiedCount} chuyến đi thành "Đã khởi hành".`,
      );
    } else {
      this.logger.log(
        '<<< [CRON] Không có chuyến đi nào cần cập nhật trạng thái "Đã khởi hành".',
      );
    }
  }

  /**
   * Tự động cập nhật các chuyến đã đến nơi (... -> ARRIVED).
   * Chạy mỗi 30 phút.
   */
  @Cron(CronExpression.EVERY_30_MINUTES, { name: 'updateArrivedTrips' })
  async handleUpdateArrivedTrips() {
    this.logger.log('>>> [CRON] Bắt đầu quét các chuyến đi đã đến nơi...');
    const now = new Date();

    const result = await this.tripModel.updateMany(
      {
        status: { $in: [TripStatus.DEPARTED, TripStatus.SCHEDULED] },
        expectedArrivalTime: { $lt: now },
      },
      {
        $set: { status: TripStatus.ARRIVED },
      },
    );

    if (result.modifiedCount > 0) {
      this.logger.log(
        `<<< [CRON] Đã cập nhật ${result.modifiedCount} chuyến đi thành "Đã đến".`,
      );
    } else {
      this.logger.log(
        '<<< [CRON] Không có chuyến đi nào cần cập nhật trạng thái "Đã đến".',
      );
    }
  }
}
