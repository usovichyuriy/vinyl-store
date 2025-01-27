import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VinylModule } from './vinyl/vinyl.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ReviewModule } from './review/review.module';
import { Reflector } from '@nestjs/core';
import { appProviders } from './app.providers';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    VinylModule,
    UserModule,
    ReviewModule,
    LoggerModule,
    PassportModule.register({ session: true }),
  ],
  providers: [Reflector, ...appProviders],
})
export class AppModule {}
