import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/users/schemas/user.schema';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  companyId?: string;
}

export interface AuthenticatedUser {
  userId: string;
  _id: string;
  email: string;
  name: string;
  roles: UserRole[];
  companyId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      console.error(
        'FATAL ERROR: JWT_SECRET is not defined in environment variables.',
      );
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined. Application cannot start.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc token không hợp lệ.',
      );
    }

    if (user.isBanned) {
      throw new UnauthorizedException('Tài khoản đã bị khóa.');
    }

    return {
      userId: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles,
      companyId: user.companyId?.toString(),
    };
  }
}
