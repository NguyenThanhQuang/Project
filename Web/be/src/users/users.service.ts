import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { email: createUserDto.email.toLowerCase() },
          { phone: createUserDto.phone },
        ],
      })
      .exec();

    if (existingUser) {
      if (existingUser.email === createUserDto.email.toLowerCase()) {
        throw new ConflictException('Email đã tồn tại');
      }
      if (existingUser.phone === createUserDto.phone) {
        throw new ConflictException('Số điện thoại đã tồn tại');
      }
    }

    const newUser = new this.userModel({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      passwordHash: createUserDto.password,
    });
    return newUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findOneByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID người dùng không hợp lệ');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  sanitizeUser(user: UserDocument): Omit<UserDocument, 'passwordHash'> {
    const { passwordHash, ...result } = user.toObject();
    return result as Omit<UserDocument, 'passwordHash'>;
  }
}
