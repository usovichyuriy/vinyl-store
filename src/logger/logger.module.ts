import { Module } from '@nestjs/common';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import LoggerService from './logger.service';
import { loggerProviders } from './logger.providers';
import LoggerController from './logger.controller';

@Module({
  imports: [SequelizeModule],
  controllers: [LoggerController],
  providers: [LoggerService, ...loggerProviders],
})
export class LoggerModule {}
