import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string, metadata: ArgumentMetadata): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `"${value}" không phải là một MongoID hợp lệ cho tham số ${metadata.data || 'ID'}.`,
      );
    }
    return new Types.ObjectId(value);
  }
}
