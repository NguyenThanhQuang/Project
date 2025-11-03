import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Tạo ra một access token từ thông tin user
   */
  generateAccessToken(user: UserDocument): string {
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      roles: user.roles,
      companyId: user.companyId?.toString(),
    };
    return this.jwtService.sign(payload);
  }
}
