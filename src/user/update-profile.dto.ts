import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  birthdate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;
}
