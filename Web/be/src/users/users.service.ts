import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, FilterQuery, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SanitizedUser, UserDocument, UserRole } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { TokenService } from 'src/auth/token/token.service';
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
        
        user = await this.usersRepository.create({
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
