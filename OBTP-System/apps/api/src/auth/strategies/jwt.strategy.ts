import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticatedUser, JwtPayload } from '@obtp/shared-types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Lấy token từ Header: Authorization Bearer ...
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Tự động reject nếu hết hạn
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Hàm này được Passport gọi sau khi verify signature thành công.
   * Nhiệm vụ: Check user còn tồn tại/active trong DB không?
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    //Query DB (Tối ưu: có thể cache ở đây nếu cần tốc độ cao)
    const user = await this.usersService.findById(payload.sub);

    //Validate trạng thái tài khoản
    if (!user) {
      throw new UnauthorizedException('Người dùng không còn tồn tại.');
    }

    if (user.isBanned) {
      throw new ForbiddenException('Tài khoản đã bị vô hiệu hóa.');
    }

    // Mapping data sang chuẩn AuthenticatedUser (Loại bỏ password, __v)
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: user.roles,
      companyId: user.companyId?.toString(),
    };
  }
}
