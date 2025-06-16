import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import {
  SanitizedUser,
  User,
  UserDocument,
  UserRole,
} from './schemas/user.schema';

export interface InternalCreateUserPayload extends CreateUserDto {
  role?: UserRole;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(payload: InternalCreateUserPayload): Promise<UserDocument> {
    const { password, ...restOfPayload } = payload;

    const existingUser = await this.userModel
      .findOne({
        $or: [{ email: payload.email.toLowerCase() }, { phone: payload.phone }],
      })
      .exec();

    if (existingUser) {
      if (existingUser.email === payload.email.toLowerCase()) {
        throw new ConflictException('Địa chỉ email này đã được sử dụng.');
      }
      if (existingUser.phone === payload.phone) {
        throw new ConflictException('Số điện thoại này đã được sử dụng.');
      }
    }

    const newUser = new this.userModel({
      ...restOfPayload,
      email: payload.email.toLowerCase(),
      passwordHash: password,
    });
    return newUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+passwordHash')
      .exec();
  }

  async findOneByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).select('+passwordHash').exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.userModel.findById(id).exec();
  }

  async findOneByCondition(
    condition: Partial<User>,
  ): Promise<UserDocument | null> {
    let query = this.userModel.findOne(condition) as import('mongoose').Query<
      UserDocument | null,
      UserDocument
    >;
    if (condition.emailVerificationToken) {
      query = query.select(
        '+emailVerificationToken +emailVerificationExpires',
      ) as import('mongoose').Query<UserDocument | null, UserDocument>;
    }
    return query.exec();
  }

  sanitizeUser(user: UserDocument): SanitizedUser {
    const userObject = user.toObject();

    const {
      passwordHash,
      emailVerificationToken,
      emailVerificationExpires,
      passwordResetToken,
      passwordResetExpires,
      __v,
      ...result
    } = userObject;
    return result as SanitizedUser;
  }
}
