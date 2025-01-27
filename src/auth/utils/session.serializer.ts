import { PassportSerializer } from '@nestjs/passport';
import AuthService from '../auth.service';
import { Injectable } from '@nestjs/common';
import { User } from 'database/models/user.model';
import { ID_USER_KEY } from 'src/user/constants/users.constants';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(user: User, done: Function) {
    done(null, user);
  }
  async deserializeUser(payload: User, done: Function) {
    const user = await this.authService.findUserByKey(ID_USER_KEY, payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
