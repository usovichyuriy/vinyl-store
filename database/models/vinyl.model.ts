import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Vinyl extends Model<Vinyl> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @Column
  price: number;

  @ApiProperty()
  @Column
  name: string;

  @ApiProperty()
  @Column
  authorName: string;

  @ApiProperty()
  @Column
  image: string;

  @ApiProperty()
  @Column
  description: string;
}
