import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { VehicleDocument } from '../vehicles/schemas/vehicle.schema';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Seat, SeatStatus, Trip, TripDocument } from './schemas/trip.schema';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    private readonly companiesService: CompaniesService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<TripDocument> {
    const company = await this.companiesService.findOne(
      createTripDto.companyId,
    );
    if (!company) {
      throw new NotFoundException(
        `Không tìm thấy nhà xe với ID: ${createTripDto.companyId}`,
      );
    }

    const vehicle = await this.vehiclesService.findOne(createTripDto.vehicleId);
    if (!vehicle) {
      throw new NotFoundException(
        `Không tìm thấy loại xe với ID: ${createTripDto.vehicleId}`,
      );
    }

    if (vehicle.companyId.toString() !== company._id.toString()) {
      throw new BadRequestException(
        `Loại xe (ID: ${vehicle._id}) không thuộc nhà xe (ID: ${company._id}).`,
      );
    }

    const seats: Seat[] = this.generateSeatsFromVehicle(vehicle);
    if (seats.length !== vehicle.totalSeats) {
      console.warn(
        `Số ghế được tạo (${seats.length}) không khớp với totalSeats của xe (${vehicle.totalSeats}). Kiểm tra lại logic generateSeatsFromVehicle hoặc seatMap của xe.`,
      );
      throw new BadRequestException(
        'Lỗi khi khởi tạo ghế cho chuyến đi từ sơ đồ xe.',
      );
    }

    const departureTime = new Date(createTripDto.departureTime);
    const expectedArrivalTime = new Date(createTripDto.expectedArrivalTime);

    if (
      isNaN(departureTime.getTime()) ||
      isNaN(expectedArrivalTime.getTime())
    ) {
      throw new BadRequestException('Thời gian đi hoặc đến không hợp lệ.');
    }
    if (departureTime >= expectedArrivalTime) {
      throw new BadRequestException(
        'Thời gian khởi hành phải trước thời gian dự kiến đến.',
      );
    }

    const existingTrip = await this.tripModel
      .findOne({
        companyId: createTripDto.companyId,
        vehicleId: createTripDto.vehicleId,
        'route.from.name': createTripDto.route.from.name,
        'route.to.name': createTripDto.route.to.name,
        departureTime: departureTime,
      })
      .exec();

    if (existingTrip) {
      throw new ConflictException(
        'Chuyến đi tương tự đã tồn tại (cùng nhà xe, xe, tuyến đường, giờ khởi hành).',
      );
    }

    const newTripData = {
      ...createTripDto,
      departureTime,
      expectedArrivalTime,
      seats,
    };

    const createdTrip = new this.tripModel(newTripData);
    return createdTrip.save();
  }

  private generateSeatsFromVehicle(vehicle: VehicleDocument): Seat[] {
    const generatedSeats: Seat[] = [];
    if (
      !vehicle.seatMap ||
      !vehicle.seatMap.layout ||
      !Array.isArray(vehicle.seatMap.layout)
    ) {
      console.warn(
        `Vehicle ID ${vehicle._id} không có seatMap.layout hợp lệ. Tạo ghế dựa trên totalSeats.`,
      );
      for (let i = 1; i <= vehicle.totalSeats; i++) {
        generatedSeats.push({
          seatNumber: `G${i}`,
          status: SeatStatus.AVAILABLE,
        });
      }
      return generatedSeats;
    }

    const { layout } = vehicle.seatMap;
    (layout as Array<Array<string | null | number>>).forEach((row) => {
      if (Array.isArray(row)) {
        row.forEach((seatElement) => {
          if (seatElement !== null && seatElement !== undefined) {
            generatedSeats.push({
              seatNumber: String(seatElement),
              status: SeatStatus.AVAILABLE,
            });
          }
        });
      }
    });

    if (generatedSeats.length !== vehicle.totalSeats) {
      console.warn(
        `[generateSeatsFromVehicle] Số ghế từ layout (${generatedSeats.length}) không khớp totalSeats (${vehicle.totalSeats}) cho xe ID ${vehicle._id}. Sẽ điều chỉnh theo totalSeats.`,
      );
      if (generatedSeats.length < vehicle.totalSeats) {
        for (let i = generatedSeats.length + 1; i <= vehicle.totalSeats; i++) {
          generatedSeats.push({
            seatNumber: `EXT${i}`,
            status: SeatStatus.AVAILABLE,
          });
        }
      } else if (generatedSeats.length > vehicle.totalSeats) {
        generatedSeats.splice(vehicle.totalSeats);
      }
    }

    return generatedSeats;
  }

  async findAll(queryTripsDto: QueryTripsDto): Promise<TripDocument[]> {
    const { from, to, date } = queryTripsDto;

    const query: any = {
      'route.from.name': new RegExp(from, 'i'),
      'route.to.name': new RegExp(to, 'i'),
      status: SeatStatus.AVAILABLE,
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.departureTime = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return this.tripModel
      .find(query)
      .populate('companyId', 'name code logoUrl')
      .populate('vehicleId', 'type totalSeats')
      .sort({ departureTime: 1 })
      .exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<TripDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID chuyến đi không hợp lệ.');
    }
    const trip = await this.tripModel
      .findById(id)
      .populate('companyId')
      .populate('vehicleId')
      .exec();

    if (!trip) {
      throw new NotFoundException(`Không tìm thấy chuyến đi với ID: ${id}`);
    }
    return trip;
  }

  async update(
    id: string,
    updateTripDto: UpdateTripDto,
  ): Promise<TripDocument> {
    const existingTrip = await this.findOne(id);

    if (
      updateTripDto.companyId &&
      updateTripDto.companyId.toString() !==
        existingTrip.companyId._id.toString()
    ) {
      await this.companiesService.findOne(updateTripDto.companyId);
    }
    if (
      updateTripDto.vehicleId &&
      updateTripDto.vehicleId.toString() !==
        existingTrip.vehicleId._id.toString()
    ) {
      const newVehicle = await this.vehiclesService.findOne(
        updateTripDto.vehicleId,
      );
      if (existingTrip.vehicleId._id.toString() !== newVehicle._id.toString()) {
        const nonAvailableSeats = existingTrip.seats.some(
          (s) => s.status !== SeatStatus.AVAILABLE,
        );
        if (nonAvailableSeats) {
          throw new BadRequestException(
            'Không thể thay đổi xe cho chuyến đi đã có ghế được giữ hoặc đặt.',
          );
        }
        const newSeats = this.generateSeatsFromVehicle(newVehicle);
        updateTripDto['seats'] = newSeats;
        console.log(`Vehicle changed for trip ${id}. Seats regenerated.`);
      }
    }

    const departureTime = updateTripDto.departureTime
      ? new Date(updateTripDto.departureTime)
      : existingTrip.departureTime;
    const expectedArrivalTime = updateTripDto.expectedArrivalTime
      ? new Date(updateTripDto.expectedArrivalTime)
      : existingTrip.expectedArrivalTime;

    if (departureTime >= expectedArrivalTime) {
      throw new BadRequestException(
        'Thời gian khởi hành phải trước thời gian dự kiến đến.',
      );
    }

    const updatePayload = { ...updateTripDto };
    if (updatePayload.departureTime)
      updatePayload.departureTime = departureTime.toISOString();
    if (updatePayload.expectedArrivalTime)
      updatePayload.expectedArrivalTime = expectedArrivalTime.toISOString();
    if (!updatePayload['seats']) {
      delete updatePayload['seats'];
    }

    const updatedTrip = await this.tripModel
      .findByIdAndUpdate(id, { $set: updatePayload }, { new: true })
      .populate('companyId')
      .populate('vehicleId')
      .exec();

    if (!updatedTrip) {
      throw new NotFoundException(
        `Không tìm thấy chuyến đi với ID: ${id} để cập nhật.`,
      );
    }
    return updatedTrip;
  }

  async remove(id: string): Promise<TripDocument> {
    const trip = await this.findOne(id);
    // const bookingsCount = await this.bookingModel.countDocuments({ tripId: id, status: { $in: ['confirmed', 'held'] } });
    // if (bookingsCount > 0) {
    //   throw new ConflictException('Không thể xóa chuyến đi khi vẫn còn vé đã đặt hoặc đang giữ chỗ.');
    // }
    await trip.deleteOne();
    return trip;
  }

  async updateSeatStatuses(
    tripId: Types.ObjectId,
    seatNumbers: string[],
    newStatus: SeatStatus,
    bookingId?: Types.ObjectId,
  ): Promise<TripDocument> {
    const trip = await this.tripModel.findById(tripId).exec();
    if (!trip) {
      throw new NotFoundException(
        `Không tìm thấy chuyến đi với ID: ${tripId} để cập nhật ghế.`,
      );
    }

    let updated = false;
    for (const seatNumber of seatNumbers) {
      const seat = trip.seats.find((s) => s.seatNumber === seatNumber);
      if (!seat) {
        throw new BadRequestException(
          `Ghế ${seatNumber} không tồn tại trong chuyến đi ${tripId}.`,
        );
      }

      if (
        newStatus === SeatStatus.HELD &&
        seat.status !== SeatStatus.AVAILABLE
      ) {
        throw new ConflictException(
          `Ghế ${seatNumber} không ở trạng thái 'available' để giữ chỗ.`,
        );
      }

      if (newStatus === SeatStatus.BOOKED) {
        if (
          seat.status !== SeatStatus.HELD &&
          seat.status !== SeatStatus.AVAILABLE
        ) {
          throw new ConflictException(
            `Ghế ${seatNumber} không ở trạng thái 'held' hoặc 'available' để đặt.`,
          );
        }
        if (
          seat.status === SeatStatus.HELD &&
          bookingId &&
          seat.bookingId?.toString() !== bookingId.toString()
        ) {
          throw new ConflictException(
            `Ghế ${seatNumber} đang được giữ bởi một yêu cầu khác.`,
          );
        }
      }

      if (newStatus === SeatStatus.AVAILABLE) {
        if (
          seat.status !== SeatStatus.HELD &&
          seat.status !== SeatStatus.BOOKED
        ) {
          // Không!
        }
        if (
          seat.status === SeatStatus.HELD &&
          bookingId &&
          seat.bookingId?.toString() !== bookingId.toString()
        ) {
          throw new ConflictException(
            `Không thể giải phóng ghế ${seatNumber} đang được giữ bởi một yêu cầu khác.`,
          );
        }
      }

      seat.status = newStatus;
      if (newStatus === SeatStatus.AVAILABLE) {
        seat.bookingId = undefined;
      } else if (bookingId) {
        seat.bookingId = bookingId;
      }
      updated = true;
    }

    if (updated) {
      return trip.save();
    }
    return trip;
  }
  async deleteAll(): Promise<any> {
    return this.tripModel.deleteMany({}).exec();
  }
}
