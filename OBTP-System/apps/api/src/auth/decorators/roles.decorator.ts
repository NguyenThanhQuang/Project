import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, UserRole } from '@obtp/shared-types';

// Chỉ nhận input là Enum UserRole, cấm string bậy bạ
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
