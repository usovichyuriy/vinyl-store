import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class IPaginationOptions {
  @ApiProperty()
  @IsOptional()
  limit?: string;

  @ApiProperty()
  @IsOptional()
  offset?: string;
}
