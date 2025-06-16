import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const mailHost = this.configService.get<string>('MAIL_HOST');
    const mailPort = parseInt(this.configService.get<string>('MAIL_PORT'), 10);
    const mailSecure = this.configService.get<string>('MAIL_SECURE') === 'true';
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD');

    if (!mailHost || !mailPort || !mailUser || !mailPassword) {
      this.logger.error(
        'Mail configuration is incomplete. Please check .env file.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailSecure,
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Mail transporter verification failed:', error);
      } else {
        this.logger.log('Mail transporter is ready to send emails.');
      }
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const baseUrl = this.configService.get<string>('CLIENT_URL')
      ? `${this.configService.get<string>('CLIENT_URL')}/auth/verify-email`
      : `${this.configService.get<string>('API_BASE_URL')}/auth/verify-email`;

    const verificationUrl = `${baseUrl}?token=${token}`;

    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Your App',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');
    const tokenExpiresText = this.configService.get<string>(
      'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_TEXT',
      '24 giờ',
    );

    if (!mailFromAddress) {
      this.logger.error('MAIL_FROM_ADDRESS is not configured.');
      throw new InternalServerErrorException(
        'Không thể gửi email do thiếu cấu hình.',
      );
    }

    const mailOptions = {
      from: `"${mailFromName}" <${mailFromAddress}>`,
      to: email,
      subject: `Xác thực địa chỉ Email cho ${mailFromName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Chào ${name},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại ${mailFromName}.</p>
          <p>Vui lòng nhấp vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Xác thực Email</a>
          </p>
          <p>Nếu nút trên không hoạt động, bạn cũng có thể sao chép và dán URL sau vào trình duyệt:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>Liên kết này sẽ hết hạn sau ${tokenExpiresText}.</p>
          <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
          <br>
          <p>Trân trọng,<br>Đội ngũ ${mailFromName}</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Verification email sent to ${email}. Message ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Error sending verification email to ${email}:`, error);
      throw new InternalServerErrorException(
        'Không thể gửi email xác thực. Vui lòng thử lại sau.',
      );
    }
  }
}
