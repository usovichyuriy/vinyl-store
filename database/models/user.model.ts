import {
  AutoIncrement,
  Column,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Review } from './review.model';
import { Purchase } from './purchase.model';
import { Role } from './role.model';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  email: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  birthdate: string;

  @Column
  avatar: string;

  @HasOne(() => Role)
  role: Role;

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Purchase)
  purchases: Purchase[];
}
