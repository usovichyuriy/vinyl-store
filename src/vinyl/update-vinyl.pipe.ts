import { BadRequestException, HttpStatus, PipeTransform } from '@nestjs/common';
import { UpdateVinylDto } from 'src/vinyl/dto/update-vinyl.dto';
import { VINYL_RESPONSE_MESSAGES } from './vinyl-response.messages';

export class UpdateVinylValidationPipe implements PipeTransform {
  transform(value: UpdateVinylDto) {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: VINYL_RESPONSE_MESSAGES.NO_VINYL_UPDATE_DATA,
      });
    }
    return value;
  }
}
