import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import AuthService from './auth.service';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Res() response: Response): void {
    response.status(HttpStatus.OK).redirect('/vinyls');
  }

  @Post('logout')
  logout(@Req() request: Request, @Res() response: Response): void {
    this.authService.logoutUser(request.session);
    response.status(HttpStatus.UNAUTHORIZED).redirect('/vinyls');
  }
}
export default AuthController;
