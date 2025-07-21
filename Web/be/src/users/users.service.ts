/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      .select(
        '+passwordHash +emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires',
      )
      .exec();
  }

  async findOneByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ phone })
      .select(
        '+passwordHash +emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires',
      )
      .exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID người dùng không hợp lệ.');
    }
    const user = await this.userModel
      .findById(id)
      .select(
        '+emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires',
      )
      .exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    return user;
  }

  async findOneByCondition(
    condition: Partial<User>,
  ): Promise<UserDocument | null> {
    const selectFields = ['+passwordHash'];
    if (condition.emailVerificationToken) {
      selectFields.push('+emailVerificationToken', '+emailVerificationExpires');
    }
    if (condition.passwordResetToken) {
      selectFields.push('+passwordResetToken', '+passwordResetExpires');
    }

    return this.userModel
      .findOne(condition)
      .select(selectFields.join(' '))
      .exec();
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

  async updateProfile(
    userId: string | Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUser> {
    const user = await this.findById(userId);

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUserWithPhone = await this.userModel
        .findOne({ phone: updateUserDto.phone })
        .exec();
      if (
        existingUserWithPhone &&
        existingUserWithPhone._id.toString() !== user._id.toString()
      ) {
        throw new ConflictException(
          'Số điện thoại này đã được sử dụng bởi một tài khoản khác.',
        );
      }
      user.phone = updateUserDto.phone;
    }

    if (typeof updateUserDto.name === 'string') {
      user.name = updateUserDto.name;
    }

    try {
      await user.save();
    } catch (error) {
      this.handleMongoError(error);
      throw new BadRequestException(
        'Không thể cập nhật thông tin người dùng. Vui lòng thử lại.',
      );
    }

    return this.sanitizeUser(user);
  }

  private handleMongoError(error: unknown): void {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: unknown }).code === 11000 &&
      'keyValue' in error
    ) {
      const mongoError = error as { keyValue: Record<string, unknown> };

      const field = Object.keys(mongoError.keyValue)[0];
      const value = mongoError.keyValue[field];

      throw new ConflictException(
        `Giá trị '${String(value)}' cho trường '${field}' đã tồn tại.`,
      );
    }
  }
}
