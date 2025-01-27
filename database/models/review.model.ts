import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Vinyl } from './vinyl.model';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Review extends Model {
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
  description: string;

  @ApiProperty()
  @Column
  reviewDate: string;

  @ApiProperty()
  @Column
  rating: number;
}
