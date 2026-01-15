import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { constructVerificationRedirectUrl } from '@obtp/business-logic';

@Injectable()
export class UrlBuilderService {
  private readonly clientUrl: string;
  private readonly verificationPath: string;

  constructor(private readonly configService: ConfigService) {
    this.clientUrl = this.configService.get<string>(
      'CLIENT_URL',
      'http://localhost:5173',
    );
    this.verificationPath = this.configService.get<string>(
      'CLIENT_VERIFICATION_RESULT_PATH',
      '/auth/verification-result',
    );
  }

  buildVerificationResultUrl(
    success: boolean,
    messageKey: string,
    accessToken?: string,
  ): string {
    return constructVerificationRedirectUrl(
      this.clientUrl,
      this.verificationPath,
      success,
      messageKey,
      accessToken,
    );
  }
}
