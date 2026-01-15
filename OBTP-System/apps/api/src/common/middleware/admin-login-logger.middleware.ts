import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AdminLoginLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('SecurityAudit');

  use(req: Request, res: Response, next: NextFunction) {
    // Chỉ log khi source header là admin-portal để tránh spam log user thường
    const sourceHeader = req.headers['x-request-source'];

    if (sourceHeader === 'admin-portal' && req.method === 'POST') {
      this.logger.log(
        `[ADMIN LOGIN ATTEMPT] IP: ${req.ip}, UA: ${req.headers['user-agent']}`,
      );
    }
    next();
  }
}
