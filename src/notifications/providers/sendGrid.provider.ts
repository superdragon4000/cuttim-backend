// src/notifications/providers/sendgrid.provider.ts
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { NotificationPayload } from '../interfaces/notification.payload';

@Injectable()
export class SendGridProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async send(payload: NotificationPayload) {
    const msg: sgMail.MailDataRequired = {
      to: payload.to,
      from: process.env.SENDGRID_FROM_EMAIL || '',
      subject: payload.subject,
      text: payload.message,
      html: `<p>${payload.message}</p>`,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('SendGrid error:', error);
      return { success: false, error };
    }
  }
}
