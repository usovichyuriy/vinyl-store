import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import AuthService from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { IGoogleProfile } from './IGoogleProfile';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(token: string, refreshToken: string, profile: IGoogleProfile) {
    const { name, emails, photos } = profile;
    const userData = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0].value,
    };
    return await this.authService.validateUser(userData);
  }
}
