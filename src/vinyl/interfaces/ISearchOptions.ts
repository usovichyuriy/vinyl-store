import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ISearchOptions {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  authorName: string;
}
