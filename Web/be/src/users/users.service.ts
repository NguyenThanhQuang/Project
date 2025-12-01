import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, FilterQuery, Types } from 'mongoose';
import { TokenService } from 'src/auth/token/token.service';
import { BookingsRepository } from 'src/bookings/bookings.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SanitizedUser, UserDocument, UserRole } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

export interface InternalCreateUserPayload extends CreateUserDto {
  role?: UserRole;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  companyId?: Types.ObjectId;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenService,
    @InjectConnection() private readonly connection: Connection,
    @Inject(forwardRef(() => BookingsRepository))
    private readonly bookingsRepository: BookingsRepository,
  ) {}

  async create(
    createUserDto: InternalCreateUserPayload,
  ): Promise<UserDocument> {
    return this.usersRepository.create(createUserDto);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findOne({ email });
  }

  async findOneByPhone(phone: string): Promise<UserDocument | null> {
    return this.usersRepository.findOne({ phone });
  }

  async findOneByCondition(
    condition: FilterQuery<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.usersRepository.findOne(condition);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.update(id, { isBanned: true });
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
      ...sanitizedUser
    } = userObject;
    return sanitizedUser as SanitizedUser;
  }

  /**
   * Cập nhật thông tin cá nhân (Profile)
   */
  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUser> {
    const updatedUser = await this.update(userId, updateUserDto);
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Đổi mật khẩu
   * Logic: Lấy user kèm password hash -> So sánh pass cũ -> Hash pass mới -> Lưu
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp.');
    }

    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác.');
    }

    user.passwordHash = newPassword;
    await this.usersRepository.save(user);

    return { message: 'Đổi mật khẩu thành công.' };
  }

  /**
   * Lấy danh sách tất cả user cho Admin
   */
  async findAllForAdmin(): Promise<SanitizedUser[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.sanitizeUser(user));
  }

  /**
   * Cập nhật trạng thái người dùng (Cấm/Bỏ cấm)
   */
  async updateUserStatus(
    userId: string,
    isBanned: boolean,
  ): Promise<SanitizedUser> {
    const updatedUser = await this.usersRepository.update(userId, { isBanned });
    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Lấy danh sách booking của user
   */
  async findUserBookings(userId: string): Promise<any[]> {
    return this.bookingsRepository.findByUserId(userId);
  }

  async createOrPromoteCompanyAdmin(payload: {
    name: string;
    email: string;
    phone: string;
    companyId: Types.ObjectId;
  }): Promise<{ user: UserDocument; isNew: boolean }> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      let user = await this.usersRepository.findOne({ email: payload.email });
      let isNew = false;

      if (user) {
        if (!user.roles.includes(UserRole.COMPANY_ADMIN)) {
          user.roles.push(UserRole.COMPANY_ADMIN);
        }
        user.companyId = payload.companyId;
        await this.usersRepository.save(user, session);
      } else {
        isNew = true;
        const activationToken = this.tokenService.generateRandomToken();

        user = await this.usersRepository.create(
          {
            email: payload.email,
            name: payload.name,
            phone: payload.phone,
            companyId: payload.companyId,
            roles: [UserRole.COMPANY_ADMIN],
            isEmailVerified: false,
            passwordHash: 'temp_password_placeholder',
            accountActivationToken: activationToken,
            accountActivationExpires: new Date(
              Date.now() + 24 * 60 * 60 * 1000,
            ),
          },
          session,
        );
      }

      await session.commitTransaction();
      return { user: user!, isNew };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
