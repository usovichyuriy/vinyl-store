import { User } from 'database/models/user.model';

export type ObjectKeys<T> = keyof T;
type ObjectValues<T> = T[keyof T];

export type UserKeys = ObjectKeys<User>;
export type UserValues = ObjectValues<User>;
