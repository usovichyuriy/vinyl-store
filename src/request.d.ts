import { User } from 'database/models/user.model';

declare module 'express' {
  interface Request {
    user: User;
  }
}
