import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AdminLoginLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('AdminLoginAttempt');

  use(req: Request, res: Response, next: NextFunction) {
    const referer = req.headers.referer;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const origin = req.headers.origin;

    const adminLoginUrlPart = '/admin/login';

    if (referer && referer.includes(adminLoginUrlPart)) {
      this.logger.log(
        `[ADMIN PORTAL] Login attempt received. IP: ${req.ip}, User-Agent: ${req.headers['user-agent']}`,
      );
    }
    next();
  }
}
