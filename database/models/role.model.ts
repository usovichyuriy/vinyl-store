import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Role extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  value: string;
}
