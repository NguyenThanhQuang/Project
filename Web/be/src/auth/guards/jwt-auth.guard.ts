import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
interface IAuthGuardRequest<TUser = any> {
  err?: Error;
  user?: TUser;
  info?: Error;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: IAuthGuardRequest['err'],
    user: IAuthGuardRequest<TUser>['user'],
    info: IAuthGuardRequest['info'],
  ): TUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token đã hết hạn.');
    }

    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Token không hợp lệ.');
    }

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Chưa xác thực hoặc token không hợp lệ.')
      );
    }

    return user;
  }
}
