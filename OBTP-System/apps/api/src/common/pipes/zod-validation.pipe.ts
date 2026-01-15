import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    // Chỉ validate body, query, param (bỏ qua custom decorator nếu không cần thiết)
    if (metadata.type === 'custom') {
      return value;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        // Format lỗi đẹp để Global Filter bắt được
        const messages = error.issues.map((err) => {
          return `${err.path.join('.')}: ${err.message}`;
        });

        throw new BadRequestException({
          message: messages,
          error: 'Bad Request',
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
