import { Injectable } from '@nestjs/common';
import { NotificationPayload } from './interfaces/notification.payload';
import { SendGridProvider } from './providers/sendGrid.provider';

@Injectable()
export class NotificationsService {
  constructor(private readonly sendGridProvider: SendGridProvider) {}

  async send(payload: NotificationPayload) {
    switch (payload.channel) {
      case 'sendGrid':
        return this.sendGridProvider.send(payload);
      case 'sms':
        return {"message": "SMS sent"}; // Placeholder for SMS sending logic
      case 'push':
        return {"message": "Push notification sent"}; // Placeholder for push notification logic
      default:
        throw new Error('Unsupported channel');
    }
  }
}
