import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(
    doc: Partial<Company>,
    session?: ClientSession,
  ): Promise<CompanyDocument> {
    const newCompany = new this.companyModel(doc);
    return newCompany.save({ session });
  }

  async findOne(
    filter: FilterQuery<CompanyDocument>,
  ): Promise<CompanyDocument | null> {
    return this.companyModel.findOne(filter).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<CompanyDocument | null> {
    return this.companyModel.findById(id).exec();
  }

  async findAll(): Promise<CompanyDocument[]> {
    return this.companyModel.find().exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<CompanyDocument>,
    session?: ClientSession,
  ): Promise<CompanyDocument | null> {
    return this.companyModel
      .findByIdAndUpdate(id, updateData, { new: true, session })
      .exec();
  }

  async save(
    company: CompanyDocument,
    session?: ClientSession,
  ): Promise<CompanyDocument> {
    return company.save({ session });
  }

  async delete(id: string): Promise<CompanyDocument | null> {
    return this.companyModel.findByIdAndDelete(id).exec();
  }

  async deleteAll(): Promise<any> {
    return this.companyModel.deleteMany({}).exec();
  }

  async getCompanyStats(): Promise<any[]> {
    return this.companyModel.aggregate([
      {
        $lookup: {
          from: 'trips',
          localField: '_id',
          foreignField: 'companyId',
          as: 'trips',
        },
      },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'companyId',
          pipeline: [{ $match: { status: 'confirmed' } }],
          as: 'bookings',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'companyId',
          as: 'reviews',
        },
      },
      {
        $project: {
          name: 1,
          code: 1,
          logoUrl: 1,
          email: 1,
          phone: 1,
          address: 1,
          createdAt: 1,
          status: 1,
          totalTrips: { $size: '$trips' },
          totalRevenue: { $sum: '$bookings.totalAmount' },
          averageRating: { $avg: '$reviews.rating' },
        },
      },
    ]);
  }
}
