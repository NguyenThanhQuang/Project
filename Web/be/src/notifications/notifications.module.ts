import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { NotificationListener } from './listeners/notification.listener';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [MailModule],
  providers: [NotificationsService, NotificationListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
