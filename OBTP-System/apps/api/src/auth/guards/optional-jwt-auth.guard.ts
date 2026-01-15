import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override để không throw error nếu không có token
  handleRequest(err: any, user: any) {
    // Nếu có lỗi hoặc không có user -> Trả về null (guest), không throw Exception
    if (err || !user) {
      return null;
    }
    return user;
  }
}
