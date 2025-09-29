import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { Trip, TripDocument, TripStatus } from './schemas/trip.schema';
import { TripsService } from './trips.service';

@Injectable()
export class TripSchedulerService {
  private readonly logger = new Logger(TripSchedulerService.name);

  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    private readonly tripsService: TripsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'createDailyTrips' })
  async handleCreateDailyTrips() {
    this.logger.log('>>> Bắt đầu tác vụ tự động tạo chuyến đi hàng ngày...');

    const templates = await this.tripModel
      .find({ isRecurrenceTemplate: true })
      .populate('vehicleId')
      .exec();

    if (templates.length === 0) {
      this.logger.log('Không tìm thấy chuyến đi mẫu nào. Kết thúc tác vụ.');
      return;
    }

    this.logger.log(
      `Tìm thấy ${templates.length} chuyến đi mẫu để tạo bản sao.`,
    );

    let createdCount = 0;
    const tomorrow = dayjs().add(1, 'day');

    for (const template of templates) {
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
          `Chuyến đi cho mẫu ${template._id} vào ngày mai đã tồn tại. Bỏ qua.`,
        );
        continue;
      }

      const newSeats = (this.tripsService as any).generateSeatsFromVehicle(
        template.vehicleId,
      );

      const tripDuration = dayjs(template.expectedArrivalTime).diff(
        template.departureTime,
      );

      const { _id, __v, ...templateData } = template.toObject();

      const newTripData: Partial<Trip> = {
        ...template.toObject(),
        isRecurrenceTemplate: false,
        recurrenceParentId: template._id,
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
}
