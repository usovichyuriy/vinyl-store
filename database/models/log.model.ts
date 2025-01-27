import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Log extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @Column
  logDate: string;

  @ApiProperty()
  @Column
  level: string;

  @ApiProperty()
  @Column
  action: string;

  @ApiProperty()
  @Column
  model: string;

  @ApiProperty()
  @Column
  modelId: number;

  @ApiProperty()
  @Column
  userId: number;
}
