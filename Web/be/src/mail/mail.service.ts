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
    const mailPortString = this.configService.get<string>('MAIL_PORT');
    const mailSecure = this.configService.get<string>('MAIL_SECURE') === 'true';
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD');

    if (!mailHost || !mailPortString || !mailUser || !mailPassword) {
      this.logger.error(
        'Mail configuration is incomplete. Please check .env file for MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD.',
      );
      throw new InternalServerErrorException(
        'Mail service configuration is incomplete. Application cannot start properly without mail functionality.',
      );
    }

    const mailPort = parseInt(mailPortString, 10);
    if (isNaN(mailPort)) {
      this.logger.error(
        `Invalid MAIL_PORT: ${mailPortString}. Must be a number.`,
      );
      throw new InternalServerErrorException(
        'Invalid mail port configuration.',
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

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Mail transporter verification failed:', error);
      } else {
        this.logger.log('Mail transporter is ready to send emails.');
      }
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const clientUrl = this.configService.get<string>(
      'CLIENT_URL',
      'http://localhost:3001', // Default client URL
    );
    // Path trên client để xử lý xác thực email
    const verificationPath = this.configService.get<string>(
      'CLIENT_EMAIL_VERIFICATION_PATH',
      '/auth/verify-email', // Default path
    );
    const verificationUrl = `${clientUrl}${verificationPath}?token=${token}`;

    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Your Awesome App', // Default sender name
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');
    const tokenExpiresText = this.configService.get<string>(
      'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_TEXT',
      '24 giờ', // Default expiry text
    );

    if (!mailFromAddress) {
      this.logger.error(
        'MAIL_FROM_ADDRESS is not configured in .env. Cannot send email.',
      );
      throw new InternalServerErrorException(
        'Không thể gửi email do thiếu cấu hình địa chỉ người gửi.',
      );
    }

    const mailOptions = {
      from: `"${mailFromName}" <${mailFromAddress}>`,
      to: email,
      subject: `Xác thực địa chỉ Email cho ${mailFromName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #007bff;">Chào ${name},</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>${mailFromName}</strong>.</p>
            <p>Để hoàn tất quá trình đăng ký và kích hoạt tài khoản, vui lòng nhấp vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
            <p style="text-align: center; margin: 25px 0;">
              <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Xác thực Email của tôi</a>
            </p>
            <p>Nếu nút trên không hoạt động, bạn cũng có thể sao chép và dán URL sau vào thanh địa chỉ của trình duyệt:</p>
            <p style="word-break: break-all;"><a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a></p>
            <p>Liên kết xác thực này sẽ có hiệu lực trong vòng <strong>${tokenExpiresText}</strong>.</p>
            <p>Nếu bạn không thực hiện yêu cầu đăng ký này, vui lòng bỏ qua email này. Tài khoản của bạn sẽ không được kích hoạt.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.9em; color: #777;">Trân trọng,<br>Đội ngũ ${mailFromName}</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Verification email sent to ${email}. Message ID: ${info.messageId}, Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
      );
    } catch (error) {
      this.logger.error(`Error sending verification email to ${email}:`, error);
      throw new InternalServerErrorException(
        'Không thể gửi email xác thực. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.',
      );
    }
  }

  // PHẦN THÊM MỚI CHO QUÊN MẬT KHẨU
  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const clientUrl = this.configService.get<string>(
      'CLIENT_URL',
      'http://localhost:3001', // Default client URL
    );
    // Path trên client để người dùng nhập mật khẩu mới
    const resetPasswordPath = this.configService.get<string>(
      'CLIENT_PASSWORD_RESET_PATH',
      '/auth/reset-password', // Default path
    );
    const resetUrl = `${clientUrl}${resetPasswordPath}?token=${token}`;

    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Your Awesome App',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');
    const tokenExpiresText = this.configService.get<string>(
      'PASSWORD_RESET_TOKEN_EXPIRES_IN_TEXT', // Sử dụng biến riêng cho password reset
      '1 giờ', // Default expiry text
    );

    if (!mailFromAddress) {
      this.logger.error(
        'MAIL_FROM_ADDRESS is not configured. Cannot send password reset email.',
      );
      throw new InternalServerErrorException(
        'Không thể gửi email do thiếu cấu hình địa chỉ người gửi.',
      );
    }

    const mailOptions = {
      from: `"${mailFromName}" <${mailFromAddress}>`,
      to: email,
      subject: `Yêu cầu Đặt lại Mật khẩu cho ${mailFromName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #dc3545;">Chào ${name},</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>${mailFromName}</strong>.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
            <p>Để đặt lại mật khẩu, vui lòng nhấp vào nút bên dưới:</p>
            <p style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Đặt lại Mật khẩu</a>
            </p>
            <p>Nếu nút trên không hoạt động, bạn cũng có thể sao chép và dán URL sau vào thanh địa chỉ của trình duyệt:</p>
            <p style="word-break: break-all;"><a href="${resetUrl}" style="color: #dc3545;">${resetUrl}</a></p>
            <p>Liên kết đặt lại mật khẩu này sẽ có hiệu lực trong vòng <strong>${tokenExpiresText}</strong>.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.9em; color: #777;">Trân trọng,<br>Đội ngũ ${mailFromName}</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Password reset email sent to ${email}. Message ID: ${info.messageId}, Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending password reset email to ${email}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.',
      );
    }
  }
  // KẾT THÚC PHẦN THÊM MỚI
}
