import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ISortOptions {
  @ApiProperty()
  @IsOptional()
  ASC?: string[];

  @ApiProperty()
  @IsOptional()
  DESC?: string[];
}
