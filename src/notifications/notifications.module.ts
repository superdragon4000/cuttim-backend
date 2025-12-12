import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendGridProvider } from './providers/sendGrid.provider';

@Module({
  providers: [NotificationsService, SendGridProvider],
  exports: [NotificationsService],
})
export class NotificationsModule {}
