import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { sanitizeAndTransformData } from '@obtp/business-logic';
import { ApiResponse } from '@obtp/shared-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        // Xử lý trường hợp trả về { message: '...', data: ... }
        let message = 'Success';
        let finalData = data;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if ('message' in data && 'data' in data) {
            message = data.message;
            finalData = data.data;
          } else if ('message' in data && Object.keys(data).length === 1) {
            // Chỉ có message, không có data (VD: Forgot Password)
            message = data.message;
            finalData = null;
          }
        }

        // Gọi Pure Logic từ package
        const cleanData = sanitizeAndTransformData(finalData);

        return {
          statusCode,
          message,
          data: cleanData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
