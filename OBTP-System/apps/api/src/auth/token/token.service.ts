import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticatedUser,
  User as IUser,
  JwtPayload,
} from '@obtp/shared-types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Tạo Access Token chuẩn JWT từ User
   * Input chấp nhận cả Mongoose Document (đã toObject) hoặc AuthenticatedUser
   */
  generateAccessToken(
    user: AuthenticatedUser | (Partial<IUser> & { _id: any }),
  ): string {
    try {
      // Mapping dữ liệu thô sang JwtPayload chuẩn
      const userId = 'id' in user ? user.id : user._id.toString();

      const payload: JwtPayload = {
        sub: userId,
        email: user.email!,
        roles: user.roles!,
        companyId: user.companyId?.toString(),
      };

      // Secret đã được inject từ AuthModule -> JwtModule registration
      // nhưng kiểm tra lại cho chắc chắn
      if (!this.configService.get<string>('JWT_SECRET')) {
        throw new InternalServerErrorException('JWT_SECRET is missing');
      }

      return this.jwtService.sign(payload);
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tạo Access Token');
    }
  }

  /**
   * (Tùy chọn) Xác thực thủ công nếu cần dùng ngoài Guard
   */
  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }
}
