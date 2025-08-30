import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserDocument | false>(
    err: any,
    user: TUser,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _info: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
  ): TUser {
    // Nếu có lỗi xác thực (ví dụ: token sai định dạng), Passport sẽ ném lỗi.
    // Nếu token hết hạn hoặc không hợp lệ, `user` sẽ là `false`.
    // Nếu không có token nào được cung cấp, `user` cũng sẽ là `false` hoặc `undefined`.
    // Trong tất cả các trường hợp đó, chỉ cần trả về `user` (có thể là object user, false, hoặc undefined).
    // Controller sẽ nhận được `req.user` là object user nếu xác thực thành công, và `undefined` nếu không.
    return user;
  }
}
