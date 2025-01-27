import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>('SESSION_SECRET');

  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE'))
    .setDescription(configService.get<string>('SWAGGER_DESCRIPTION'))
    .setVersion(configService.get<string>('SWAGGER_VERSION'))
    .addTag(configService.get<string>('SWAGGER_TAG'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get<string>('SWAGGER_PATH'), app, document);

  const port = configService.get<number>('APP_PORT');
  await app.listen(port);
}
bootstrap();
