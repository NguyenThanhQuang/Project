import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    user: Partial<User>,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save({ session });
  }

  async findOne(
    filter: FilterQuery<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne(filter).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIdWithPassword(
    id: string | Types.ObjectId,
  ): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+passwordHash').exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<UserDocument>,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true, session })
      .exec();
  }

  async save(
    user: UserDocument,
    session?: ClientSession,
  ): Promise<UserDocument> {
    return user.save({ session });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
