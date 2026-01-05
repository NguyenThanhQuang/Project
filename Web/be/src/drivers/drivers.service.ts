import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Driver, DriverStatus } from './schema/driver.schema';
import { Connection, Model, Types } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { Trip, TripDocument, TripStatus } from 'src/trips/schemas/trip.schema';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from 'src/bookings/schemas/booking.schema';

@Injectable()
export class DriversService {
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  constructor(@InjectModel(Driver.name) private driverModel:Model<Driver>,
   @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
   @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
@InjectConnection() private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,){}

    
async findById(id:number){
  const driver = await this.driverModel.findById(id)
  return driver
}

async create(
  dto: CreateDriverDto,
  companyId: string | Types.ObjectId,
) {
  const companyObjectId =
    typeof companyId === 'string'
      ? new Types.ObjectId(companyId)
      : companyId;

  const existingDriver = await this.driverModel.findOne({
    $or: [
      ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
      ...(dto.phone ? [{ phone: dto.phone }] : []),
    ],
  });

  if (existingDriver?.companyId) {
    throw new ConflictException(
      'Tài xế này đã được nhận vào một nhà xe.',
    );
  }
  const driver = new this.driverModel({
    ...dto,
    email: dto.email?.toLowerCase(),
    companyId: companyObjectId,
    status: DriverStatus.ACTIVE,
  });

  return driver.save();
}

  async getDriverProfile(driverId: string) {
    if (!Types.ObjectId.isValid(driverId)) {
      throw new NotFoundException('Driver ID không hợp lệ.');
    }

    // 1️⃣ Lấy driver + company
    const driver = await this.driverModel
      .findById(driverId)
      .populate({
        path: 'companyId',
        select: 'name code logoUrl phone email address status',
      })
      .lean()
      .exec();

    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế.');
    }

    // 2️⃣ Lấy user account gắn với driver
    const user = await this.userModel
      .findOne({ driverId: driver._id })
      .select('email phone roles isEmailVerified lastLoginDate createdAt')
      .lean()
      .exec();

    return {
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        address: driver.address,
        avatarUrl: driver.avatarUrl,
        license: driver.license,
        description: driver.description,
        status: driver.status,
      },
      company: driver.companyId
        ? {
            id: (driver.companyId as any)._id,
            name: (driver.companyId as any).name,
            code: (driver.companyId as any).code,
            logoUrl: (driver.companyId as any).logoUrl,
            phone: (driver.companyId as any).phone,
            email: (driver.companyId as any).email,
            address: (driver.companyId as any).address,
            status: (driver.companyId as any).status,
          }
        : null,
      account: user
        ? {
            userId: user._id,
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            isEmailVerified: user.isEmailVerified,
            lastLoginDate: user.lastLoginDate,
          }
        : null,
    };
  }
    async getTripsByDriverAndStatus(
    driverId: string | Types.ObjectId,
    status: TripStatus,
  ): Promise<TripDocument[]> {
    const driverObjectId =
      typeof driverId === 'string'
        ? new Types.ObjectId(driverId)
        : driverId;

    return this.tripModel
      .find({
        driverId: driverObjectId,
        status,
      })
      .populate('companyId', 'name logoUrl')
      .populate('vehicleId', 'type vehicleNumber')
      .populate('route.fromLocationId', 'name province')
      .populate('route.toLocationId', 'name province')
      .sort({ departureTime: -1 })
      .exec();
  }
  async getUpcomingTrips(driverId: string | Types.ObjectId) {
  return this.getTripsByDriverAndStatus(
    driverId,
    TripStatus.SCHEDULED,
  );
}
async getOngoingTrips(driverId: string | Types.ObjectId) {
  return this.getTripsByDriverAndStatus(
    driverId,
    TripStatus.DEPARTED,
  );
}
async getCompletedTrips(driverId: string | Types.ObjectId) {
  return this.getTripsByDriverAndStatus(
    driverId,
    TripStatus.ARRIVED,
  );
}
 async getDriverMonthlyRevenue(driverId: string, year?: number): Promise<
    Array<{
      month: string;        // YYYY-MM
      totalRevenue: number; // sum totalAmount
      totalBookings: number;
      totalTickets: number; // tổng số passengers (tổng vé)
    }>
  > {
    if (!Types.ObjectId.isValid(driverId)) {
      throw new BadRequestException('driverId không hợp lệ.');
    }

    const driverObjectId = new Types.ObjectId(driverId);

    // Optional: lọc theo năm dựa trên bookingTime
    const yearMatch =
      typeof year === 'number'
        ? {
            bookingTime: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
          }
        : {};

    return this.bookingModel
      .aggregate([
        // 1) Chỉ lấy booking đã confirmed + paid
        {
          $match: {
            status: BookingStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
            ...yearMatch,
          },
        },

        // 2) Join sang trips để biết driverId + trip status
        {
          $lookup: {
            from: 'trips',
            localField: 'tripId',
            foreignField: '_id',
            as: 'trip',
          },
        },
        { $unwind: '$trip' },

        // 3) Lọc: trip của tài xế + trip đã hoàn thành
        {
          $match: {
            'trip.driverId': driverObjectId, // Trip MUST có field driverId
            'trip.status': TripStatus.ARRIVED,
          },
        },

        // 4) Group theo tháng (YYYY-MM) dựa trên bookingTime
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m', date: '$bookingTime' },
            },
            totalRevenue: { $sum: '$totalAmount' },
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: { $size: '$passengers' } },
          },
        },

        // 5) Sort theo tháng tăng dần
        { $sort: { _id: 1 } },

        // 6) Format output
        {
          $project: {
            _id: 0,
            month: '$_id',
            totalRevenue: 1,
            totalBookings: 1,
            totalTickets: 1,
          },
        },
      ])
      .exec();
  }
  async driverCompleteTrip(
    tripId: string,
    driverId: string,
  ): Promise<TripDocument> {
    if (!Types.ObjectId.isValid(tripId) || !Types.ObjectId.isValid(driverId)) {
      throw new BadRequestException('tripId hoặc driverId không hợp lệ.');
    }

    const trip = await this.tripModel.findById(tripId).exec();

    if (!trip) {
      throw new NotFoundException('Không tìm thấy chuyến đi.');
    }

    // 1️⃣ Kiểm tra quyền: trip có đúng tài xế không
    if (
      !trip.driverId ||
      trip.driverId.toString() !== driverId
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật trạng thái chuyến đi này.',
      );
    }

    // 2️⃣ Validate luồng trạng thái
    if (trip.status === TripStatus.ARRIVED) {
      throw new BadRequestException(
        'Chuyến đi này đã được hoàn thành trước đó.',
      );
    }

    if (trip.status !== TripStatus.DEPARTED) {
      throw new BadRequestException(
        'Chỉ có thể hoàn thành chuyến đi đang ở trạng thái đang chạy.',
      );
    }

    // 3️⃣ Cập nhật trạng thái
    trip.status = TripStatus.ARRIVED;
    await trip.save();

    return trip;
  }
  async driverStartTrip(
  tripId: string,
  driverId: string,
): Promise<TripDocument> {
  const trip = await this.tripModel.findById(tripId).exec();

  if (!trip) throw new NotFoundException('Không tìm thấy chuyến đi.');

  if (!trip.driverId || trip.driverId.toString() !== driverId) {
    throw new ForbiddenException('Bạn không có quyền.');
  }

  if (trip.status !== TripStatus.SCHEDULED) {
    throw new BadRequestException(
      'Chỉ có thể bắt đầu chuyến đi chưa khởi hành.',
    );
  }

  trip.status = TripStatus.DEPARTED;
  await trip.save();

  return trip;
}

}

