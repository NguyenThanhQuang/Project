import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        let message = 'Success';
        let finalData = data;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if ('message' in data && 'data' in data) {
            // Trường hợp controller trả về { message: '...', data: ... } (ví dụ login)
            message = data.message;
            finalData = data.data;
          } else if ('message' in data && Object.keys(data).length === 1) {
            // Trường hợp chỉ trả về { message: '...' }
            message = data.message;
            finalData = null;
          }
        }

        const transformedData = this.transformIds(finalData);

        return {
          statusCode,
          message,
          data: transformedData,
        };
      }),
    );
  }

  private transformIds(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.transformIds(item));
    }

    if (data instanceof Types.ObjectId) {
      return data.toString();
    }

    if (data instanceof Date) {
      return data;
    }

    if (typeof data === 'object') {
      if (typeof data.toObject === 'function') {
        data = data.toObject();
      }

      const newData: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (key === '_id') {
            newData['id'] = data[key].toString();
          } else if (key === '__v') {
            continue;
          } else {
            newData[key] = this.transformIds(data[key]);
          }
        }
      }
      return newData;
    }

    return data;
  }
}
