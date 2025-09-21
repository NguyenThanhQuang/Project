import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AdminLoginLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('AdminLoginAttempt');

  use(req: Request, res: Response, next: NextFunction) {
    const sourceHeader = req.headers['x-request-source'];

    // if (sourceHeader === 'admin-portal') {
    //   this.logger.log(
    //     `[ADMIN PORTAL] Login attempt received. IP: ${req.ip}, User-Agent: ${req.headers['user-agent']}`,
    //   );
    // }
    next();
  }
}
