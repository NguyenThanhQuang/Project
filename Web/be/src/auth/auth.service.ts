import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto): Promise<{
    accessToken: string;
    user: Omit<UserDocument, 'passwordHash'>;
  }> {
    try {
      const user = await this.usersService.create({
        ...registerDto,
        role: UserRole.USER,
      });

      const payload: JwtPayload = {
        email: user.email,
        sub: user._id.toString(),
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload);
      return {
        accessToken,
        user: this.usersService.sanitizeUser(user),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Đăng ký không thành công. Vui lòng thử lại.',
      );
    }
  }

  async validateUser(
    identifier: string,
    pass: string,
  ): Promise<UserDocument | null> {
    let user: UserDocument | null = null;

    if (isEmail(identifier)) {
      user = await this.usersService.findOneByEmail(identifier);
    } else {
      user = await this.usersService.findOneByPhone(identifier);
    }

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    user: Omit<UserDocument, 'passwordHash'>;
  }> {
    const user = await this.validateUser(
      loginDto.identifier,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException(
        'Email/Số điện thoại hoặc mật khẩu không chính xác.',
      );
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.usersService.sanitizeUser(user),
    };
  }
}
