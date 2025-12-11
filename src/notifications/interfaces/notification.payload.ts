export interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  channel: 'sendGrid' | 'sms' | 'push';
}