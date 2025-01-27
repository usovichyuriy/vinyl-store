import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
class EmailService {
  constructor(private readonly configService: ConfigService) {}
  smtpConfig: SMTPTransport.Options = {
    service: this.configService.get<string>('NOTIFICATION_SERVICE'),
    host: this.configService.get<string>('EMAIL_NOTIFICATION_HOST'),
    port: this.configService.get<number>('EMAIL_NOTIFICATION_PORT'),
    secure: true,
    auth: {
      user: this.configService.get<string>('EMAIL_ADDRESS'),
      pass: this.configService.get<string>('EMAIL_PASSWORD'),
    },
  };

  createPurchaseDetailsMessage(
    productId: string,
    sessionId: string,
    currency: string,
    totalAmount: number,
  ): string {
    return `\nSession number: ${sessionId}\nProduct number: ${productId}\nTotal price: ${totalAmount / 100}${currency}`;
  }

  async sendEmailNotification(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport(this.smtpConfig);
    try {
      await transporter.sendMail({
        to: to,
        subject: subject,
        text: text,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
export default EmailService;
