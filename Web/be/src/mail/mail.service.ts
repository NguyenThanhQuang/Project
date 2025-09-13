import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { BookingDocument } from 'src/bookings/schemas/booking.schema';
import { LocationDocument } from 'src/locations/schemas/location.schema';
import { TripDocument } from 'src/trips/schemas/trip.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

type PopulatedTrip = Omit<TripDocument, 'route' | 'companyId'> & {
  route: {
    fromLocationId: LocationDocument;
    toLocationId: LocationDocument;
  };
  companyId: {
    name: string;
  };
};
type PopulatedBooking = Omit<BookingDocument, 'tripId' | 'userId'> & {
  tripId: PopulatedTrip;
  userId?: UserDocument;
};

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
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
    const apiBaseUrl = this.configService.get<string>('API_BASE_URL');

    if (!apiBaseUrl) {
      this.logger.error(
        'API_BASE_URL is not configured in .env. Cannot send verification email.',
      );
      throw new InternalServerErrorException(
        'Lỗi cấu hình hệ thống, không thể gửi email.',
      );
    }

    const verificationUrl = `${apiBaseUrl}/auth/verify-email?token=${token}`;
    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Online Bus Ticket Platform',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');
    const tokenExpiresText = this.configService.get<string>(
      'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_TEXT',
      '24 giờ',
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

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const clientUrl = this.configService.get<string>(
      'CLIENT_URL',
      'http://localhost:3001',
    );
    const resetPasswordPath = this.configService.get<string>(
      'CLIENT_PASSWORD_RESET_PATH',
      '/auth/reset-password',
    );
    const resetUrl = `${clientUrl}${resetPasswordPath}?token=${token}`;

    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Your Awesome App',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');
    const tokenExpiresText = this.configService.get<string>(
      'PASSWORD_RESET_TOKEN_EXPIRES_IN_TEXT',
      '1 giờ',
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
  async sendBookingConfirmationEmail(booking: BookingDocument) {
    const populatedBooking = booking as unknown as PopulatedBooking;

    const {
      contactEmail,
      contactName,
      ticketCode,
      passengers,
      totalAmount,
      tripId: tripInfo,
    } = populatedBooking;

    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Your App',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');

    if (!mailFromAddress) {
      this.logger.error(
        'MAIL_FROM_ADDRESS is not configured. Cannot send email.',
      );
      return;
    }

    const mailOptions = {
      from: `"${mailFromName}" <${mailFromAddress}>`,
      to: contactEmail,
      subject: `[${mailFromName}] Xác nhận đặt vé thành công - Mã vé: ${ticketCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1>Cảm ơn bạn đã đặt vé!</h1>
          <p>Chào <strong>${contactName}</strong>,</p>
          <p>Đơn đặt vé của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong>Mã vé:</strong> <span style="font-size: 1.2em; color: #d9534f; font-weight: bold;">${ticketCode}</span></li>
            <li style="margin-bottom: 10px;"><strong>Hành trình:</strong> ${tripInfo.route.fromLocationId.name} → ${tripInfo.route.toLocationId.name}</li>
            <li style="margin-bottom: 10px;"><strong>Nhà xe:</strong> ${tripInfo.companyId.name}</li>
            <li style="margin-bottom: 10px;"><strong>Thời gian khởi hành:</strong> ${new Date(tripInfo.departureTime).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })}</li>
            <li style="margin-bottom: 10px;"><strong>Số ghế:</strong> ${passengers.map((p) => p.seatNumber).join(', ')}</li>
            <li style="margin-bottom: 10px;"><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString('vi-VN')} VNĐ</li>
          </ul>
          <p>Vui lòng có mặt tại điểm đi trước 30 phút. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          <hr>
          <p style="font-size: 0.8em; color: #777;">Đây là email tự động, vui lòng không trả lời.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Booking confirmation email sent to ${contactEmail}`);
    } catch (error) {
      this.logger.error(
        `Error sending booking confirmation email to ${contactEmail}`,
        error,
      );
    }
  }

  async sendCompanyAdminActivationEmail(
    email: string,
    name: string,
    token: string,
  ) {
    const clientUrl = this.configService.get<string>(
      'CLIENT_URL',
      'http://localhost:5173',
    );
    const activationUrl = `${clientUrl}/activate-account?token=${token}`;
    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Online Bus Ticket Platform',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');

    const mailOptions = {
      from: `"${mailFromName}" <${mailFromAddress}>`,
      to: email,
      subject: `[${mailFromName}] Kích hoạt tài khoản Quản trị Nhà xe của bạn`,
      html: `
            <div style="font-family: Arial, sans-serif; ...">
                <h2>Chào ${name},</h2>
                <p>Một tài khoản quản trị nhà xe đã được tạo cho bạn trên hệ thống <strong>${mailFromName}</strong>.</p>
                <p>Để hoàn tất, vui lòng nhấp vào nút bên dưới để kích hoạt tài khoản và đặt mật khẩu của riêng bạn:</p>
                <p style="text-align: center;">
                    <a href="${activationUrl}" style="...">Kích hoạt Tài khoản & Đặt Mật khẩu</a>
                </p>
                <p>Liên kết này sẽ có hiệu lực trong vòng 24 giờ.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
            </div>
        `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendCompanyAdminPromotionEmail(
    email: string,
    name: string,
    companyName: string,
  ) {
    const clientUrl = this.configService.get<string>(
      'CLIENT_URL',
      'http://localhost:5173',
    );
    const mailFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Online Bus Ticket Platform',
    );
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS');

    const mailOptions = {
      from: `"${mailFromName}" <${mailFromAddress}>`,
      to: email,
      subject: `[${mailFromName}] Tài khoản của bạn đã được nâng cấp quyền`,
      html: `
            <div style="font-family: Arial, sans-serif; ...">
                <h2>Chào ${name},</h2>
                <p>Chúng tôi xin thông báo tài khoản của bạn trên hệ thống <strong>${mailFromName}</strong> đã được cấp quyền Quản trị cho nhà xe <strong>${companyName}</strong>.</p>
                <p>Bạn có thể đăng nhập ngay bây giờ bằng mật khẩu hiện tại của mình để bắt đầu quản lý.</p>
                <p style="text-align: center;">
                    <a href="${clientUrl}/login" style="...">Đăng nhập ngay</a>
                </p>
            </div>
        `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
