import { Module } from '@nestjs/common';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import ReviewController from './review.controller';
import ReviewService from './review.service';
import { reviewProviders } from './review.providers';
import VinylService from 'src/vinyl/vinyl.service';
import StripeService from 'src/stripe/stripe.service';
import EmailService from 'src/email/email.service';
import TelegramService from 'src/telegram/telegram.service';
import LogsService from 'src/logger/logger.service';

@Module({
  imports: [SequelizeModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    VinylService,
    StripeService,
    EmailService,
    TelegramService,
    LogsService,
    ...reviewProviders,
  ],
})
export class ReviewModule {}
