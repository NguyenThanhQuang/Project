import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Injectable()
export class BookingsRepository {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async create(
    doc: Partial<Booking>,
    session?: ClientSession,
  ): Promise<BookingDocument> {
    const newBooking = new this.bookingModel(doc);
    return newBooking.save({ session });
  }

  async findById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<BookingDocument | null> {
    return this.bookingModel
      .findById(id)
      .session(session || null)
      .exec();
  }

  async findOne(
    filter: FilterQuery<BookingDocument>,
  ): Promise<BookingDocument | null> {
    return this.bookingModel.findOne(filter).exec();
  }

  async findByCondition(
    condition: FilterQuery<BookingDocument>,
  ): Promise<BookingDocument | null> {
    return this.bookingModel.findOne(condition).exec();
  }

  async findForLookup(
    filter: FilterQuery<BookingDocument>,
  ): Promise<BookingDocument | null> {
    return this.bookingModel
      .findOne(filter)
      .populate({
        path: 'tripId',
        populate: [
          { path: 'companyId', select: 'name logoUrl' },
          { path: 'route.fromLocationId', select: 'name fullAddress' },
          { path: 'route.toLocationId', select: 'name fullAddress' },
        ],
      })
      .select('-paymentGatewayTransactionId')
      .exec();
  }

  async save(
    booking: BookingDocument,
    session?: ClientSession,
  ): Promise<BookingDocument> {
    return booking.save({ session });
  }
}
