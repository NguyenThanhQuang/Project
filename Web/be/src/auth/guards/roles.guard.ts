import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    interface RequestWithUser extends Request {
      user?: { roles?: UserRole };
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new UnauthorizedException(
        'Yêu cầu chưa được xác thực hoặc không có thông tin người dùng.',
      );
    }

    const hasPermission = user.roles.some((role) =>
      requiredRoles.includes(role),
    );

    if (hasPermission) {
      return true;
    }

    throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này.');
  }
}
