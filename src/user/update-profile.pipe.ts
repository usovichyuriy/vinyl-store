import { BadRequestException, HttpStatus, PipeTransform } from '@nestjs/common';
import { UpdateProfileDto } from 'src/user/update-profile.dto';
import { USER_RESPONSE_MESSAGES } from './constants/user-response.messages';

export class UpdateProfileValidationPipe implements PipeTransform {
  transform(value: UpdateProfileDto) {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: USER_RESPONSE_MESSAGES.NO_PROFILE_UPDATE_DATA,
      });
    }
    return value;
  }
}
