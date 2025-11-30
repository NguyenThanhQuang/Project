import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { Trip, TripDocument, TripStatus } from './schemas/trip.schema';

@Injectable()
export class TripsRepository {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
  ) {}

  async create(
    doc: Partial<Trip>,
    session?: ClientSession,
  ): Promise<TripDocument> {
    const newTrip = new this.tripModel(doc);
    return newTrip.save({ session });
  }

  async findById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<TripDocument | null> {
    return this.tripModel
      .findById(id)
      .session(session || null)
      .exec();
  }

  async findByIdWithDetails(
    id: string | Types.ObjectId,
  ): Promise<TripDocument | null> {
    return this.tripModel
      .findById(id)
      .populate('companyId')
      .populate(
        'vehicleId',
        'type seatMap seatMapFloor2 floors aisleAfterColumn totalSeats description',
      )
      .populate('route.fromLocationId')
      .populate('route.toLocationId')
      .populate({ path: 'route.stops.locationId', model: 'Location' })
      .exec();
  }

  async findOne(
    filter: FilterQuery<TripDocument>,
  ): Promise<TripDocument | null> {
    return this.tripModel.findOne(filter).exec();
  }

  async findPublicTrips(
    startOfDay: Date,
    endOfDay: Date,
  ): Promise<TripDocument[]> {
    return this.tripModel
      .find({
        departureTime: { $gte: startOfDay, $lte: endOfDay },
        status: TripStatus.SCHEDULED,
      })
      .populate({
        path: 'companyId',
        select: 'name logoUrl status',
      })
      .populate({
        path: 'vehicleId',
        select: 'type',
      })
      .populate({
        path: 'route.fromLocationId',
        select: 'name province',
      })
      .populate({
        path: 'route.toLocationId',
        select: 'name province',
      })
      .lean<TripDocument[]>()
      .exec();
  }

  async findManagementTrips(
    filter: FilterQuery<TripDocument>,
  ): Promise<TripDocument[]> {
    return this.tripModel
      .find(filter)
      .populate('companyId', 'name')
      .populate('vehicleId', 'type vehicleNumber')
      .populate('route.fromLocationId', 'name province')
      .populate('route.toLocationId', 'name province')
      .sort({ departureTime: -1 })
      .exec();
  }

  async countDocuments(filter: FilterQuery<TripDocument>): Promise<number> {
    return this.tripModel.countDocuments(filter).exec();
  }

  async save(
    trip: TripDocument,
    session?: ClientSession,
  ): Promise<TripDocument> {
    return trip.save({ session });
  }
}
