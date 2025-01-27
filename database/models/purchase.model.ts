import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Vinyl } from './vinyl.model';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Purchase extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ApiProperty()
  @ForeignKey(() => Vinyl)
  @Column
  vinylId: number;

  @ApiProperty()
  @Column
  purchaseDate: string;
}
