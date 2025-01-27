import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import LoggerService from './logger.service';
import { Response } from 'express';
import { Roles } from 'src/role/roles.decorator';
import { ROLES_CONSTANTS } from 'src/role/roles.constants';
import { GoogleAuthGuard } from 'src/auth/utils/google-auth.guard';

@ApiTags('logs')
@UseGuards(GoogleAuthGuard)
@Controller('logs')
class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [String] })
  @Roles([ROLES_CONSTANTS.ADMIN])
  @Get()
  async getSystemLogs(@Res() response: Response<string[]>): Promise<void> {
    const systemLogs = await this.loggerService.getLogs();
    response.status(HttpStatus.OK).send(systemLogs);
  }
}
export default LoggerController;
