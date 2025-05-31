import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn.');
      }
      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ.');
      }
      throw (
        err ||
        new UnauthorizedException('Chưa xác thực hoặc token không hợp lệ.')
      );
    }
    return user;
  }
}
