import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import { authProviders } from './auth.providers';
import { GoogleStrategy } from './utils/google.strategy';
import { SessionSerializer } from './utils/session.serializer';
import LoggerService from 'src/logger/logger.service';

@Module({
  imports: [SequelizeModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionSerializer,
    GoogleStrategy,
    LoggerService,
    ...authProviders,
  ],
})
export class AuthModule {}
