import { Module } from '@nestjs/common';
import VinylController from './vinyl.controller';
import VinylService from './vinyl.service';
import { vinylProviders } from './vinyl.providers';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import StripeService from 'src/stripe/stripe.service';
import EmailService from 'src/email/email.service';
import TelegramService from 'src/telegram/telegram.service';
import LoggerService from 'src/logger/logger.service';

@Module({
  imports: [SequelizeModule],
  controllers: [VinylController],
  providers: [
    VinylService,
    StripeService,
    EmailService,
    TelegramService,
    LoggerService,
    ...vinylProviders,
  ],
})
export class VinylModule {}
