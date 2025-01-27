import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_NOTIFICATION_CONSTANTS } from './telegram.constants';
import { Vinyl } from 'database/models/vinyl.model';

@Injectable()
class TelegramService {
  private telegramBot: TelegramBot;
  constructor(private readonly configService: ConfigService) {
    this.telegramBot = new TelegramBot(
      this.configService.get<string>('TELEGRAM_TOKEN'),
    );
  }

  createTelegramMessage(vinyl: Vinyl): string {
    return (
      TELEGRAM_NOTIFICATION_CONSTANTS.MESSAGE +
      '\n' +
      vinyl.authorName +
      ' - ' +
      vinyl.name +
      '\n' +
      vinyl.price +
      '$'
    );
  }
  async sendTelegramNotification(vinyl: Vinyl): Promise<void> {
    await this.telegramBot.sendMessage(
      this.configService.get<TelegramBot.ChatId>('TELEGRAM_CHAT_ID'),
      this.createTelegramMessage(vinyl),
      {
        parse_mode: this.configService.get<TelegramBot.ParseMode>(
          'TELEGRAM_MESSAGE_PARSE_MODE',
        ),
      },
    );
  }
}
export default TelegramService;
