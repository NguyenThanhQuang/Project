import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser, ROLES_KEY, UserRole } from '@obtp/shared-types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy metadata Roles từ Decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không yêu cầu role gì -> Pass
    if (!requiredRoles) {
      return true;
    }

    // Lấy User từ Request (Đã qua JwtStrategy validate)
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();

    if (!user || !user.roles) {
      throw new ForbiddenException('Không tìm thấy thông tin quyền hạn.');
    }

    // So khớp: User có ít nhất 1 role khớp với yêu cầu không
    // Hoặc Admin tối thượng luôn có quyền
    const hasRole = user.roles.some((role) => requiredRoles.includes(role));

    // Admin hệ thống (ADMIN) thường đi đâu cũng được (Optional)
    const isAdmin = user.roles.includes(UserRole.ADMIN);

    if (hasRole || isAdmin) {
      return true;
    }

    throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này.');
  }
}
