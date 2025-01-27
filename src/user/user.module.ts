import { Module } from '@nestjs/common';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import { userProviders } from './user.providers';
import UserController from './user.controller';
import UserService from './user.service';
import LoggerService from 'src/logger/logger.service';

@Module({
  imports: [SequelizeModule],
  controllers: [UserController],
  providers: [UserService, LoggerService, ...userProviders],
})
export class UserModule {}
