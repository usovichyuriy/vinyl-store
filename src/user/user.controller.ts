import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import UsersService from './user.service';
import { IUserProfile } from './interfaces/IUserProfile';
import { Request, Response } from 'express';
import { UpdateProfileDto } from './update-profile.dto';
import { USER_RESPONSE_MESSAGES } from './constants/user-response.messages';
import { UpdateProfileValidationPipe } from './update-profile.pipe';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from 'src/auth/utils/google-auth.guard';

@ApiTags('profile')
@UseGuards(GoogleAuthGuard)
@Controller('profile')
class UserController {
  constructor(private readonly usersService: UsersService) {}

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: IUserProfile })
  @Get()
  async getProfile(
    @Req() request: Request,
    @Res() response: Response<IUserProfile>,
  ): Promise<void> {
    const profile = await this.usersService.getMyProfile(request.user.id);
    response.status(HttpStatus.OK).send(profile);
  }

  @ApiNotFoundResponse()
  @ApiOkResponse({ description: USER_RESPONSE_MESSAGES.PROFILE_WAS_UPDATED })
  @Put()
  async editProfile(
    @Body(new UpdateProfileValidationPipe()) updateProfileDto: UpdateProfileDto,
    @Req() request: Request,
    @Res() response: Response<string>,
  ): Promise<void> {
    await this.usersService.editMyProfile(request.user.id, updateProfileDto);
    response
      .status(HttpStatus.OK)
      .send(USER_RESPONSE_MESSAGES.PROFILE_WAS_UPDATED);
  }

  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Delete()
  async deleteProfile(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.usersService.deleteMyProfile(request.user.id);
    response
      .status(HttpStatus.NO_CONTENT)
      .send(USER_RESPONSE_MESSAGES.PROFILE_WAS_DELETED);
  }
}
export default UserController;
